# -*- coding: utf-8 -*-


# OpenFisca -- A versatile microsimulation software
# By: OpenFisca Team <contact@openfisca.fr>
#
# Copyright (C) 2011, 2012, 2013, 2014 OpenFisca Team
# https://github.com/openfisca
#
# This file is part of OpenFisca.
#
# OpenFisca is free software; you can redistribute it and/or modify
# it under the terms of the GNU Affero General Public License as
# published by the Free Software Foundation, either version 3 of the
# License, or (at your option) any later version.
#
# OpenFisca is distributed in the hope that it will be useful,
# but WITHOUT ANY WARRANTY; without even the implied warranty of
# MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
# GNU Affero General Public License for more details.
#
# You should have received a copy of the GNU Affero General Public License
# along with this program.  If not, see <http://www.gnu.org/licenses/>.


"""Form controllers"""


import babel.dates
from bson import objectid
import datetime

from biryani1.baseconv import check, pipe
from biryani1 import strings
from formencode import variabledecode

from .. import conf, contexts, conv, model, questions, templates, uuidhelpers, wsgihelpers


@wsgihelpers.wsgify
def situation_form_get(req):
    ctx = contexts.Ctx(req)

    if conf['cookie'] in req.cookies:
        update_session(ctx)
        session = ctx.session
        if req.cookies.get(conf['cookie']) != session.token:
            req.response.set_cookie(
                conf['cookie'],
                session.token,
                httponly = True,
                secure = req.scheme == 'https',
                )

    user = model.get_user(ctx)
    if user is None:
        # Allow user to be None for viewing simulation in background when accept cookie modal is displayed.
        user_api_data = {}
    else:
        user.ensure_test_case()
        user_api_data = user.current_test_case.api_data or {}
    filled_user_api_data = check(conv.base.make_fill_user_api_data(ensure_api_compliance = False)(user_api_data))

    if model.fields_api_data() is None:
        return wsgihelpers.internal_error(ctx, explanation = ctx._(u'Unable to retrieve form fields.'))
    root_question = questions.base.make_situation_form(filled_user_api_data)
    values, errors = pipe(
        conv.base.api_data_to_korma_data,
        root_question.root_data_to_str,
        )(filled_user_api_data, state = ctx)
    root_question.fill(values, errors)

    return templates.render_def(ctx, '/index.mako', 'situation_form', root_question = root_question) \
        if req.is_xhr or req.params.get('xhr') \
        else templates.render(ctx, '/index.mako', root_question = root_question)


@wsgihelpers.wsgify
def situation_form_post(req):
    ctx = contexts.Ctx(req)

    if conf['cookie'] in req.cookies:
        update_session(ctx)
        session = ctx.session
        if req.cookies.get(conf['cookie']) != session.token:
            req.response.set_cookie(
                conf['cookie'],
                session.token,
                httponly = True,
                secure = req.scheme == 'https',
                )

    user = model.get_user(ctx, check = True)
    user.ensure_test_case()
    current_test_case = user.current_test_case
    user_api_data = current_test_case.api_data or {}
    if model.fields_api_data() is None:
        return wsgihelpers.internal_error(ctx, explanation = ctx._(u'Unable to retrieve form fields.'))
    root_question = questions.base.make_situation_form(user_api_data)
    inputs = variabledecode.variable_decode(req.params)
    data, errors = root_question.root_input_to_data(inputs, state = ctx)
    if errors is not None:
        root_question.fill(inputs, errors)
        if req.is_xhr:
            form_html = templates.render_def(ctx, '/index.mako', 'situation_form', root_question = root_question)
            return wsgihelpers.respond_json(ctx, {'errors': errors, 'html': form_html})
        else:
            return templates.render(ctx, '/index.mako', root_question = root_question)
    api_data, errors = conv.base.korma_data_to_api_data(data, state = ctx)
    if errors is not None:
        root_question.fill(api_data, errors)
        if req.is_xhr:
            form_html = templates.render_def(ctx, '/index.mako', 'situation_form', root_question = root_question)
            return wsgihelpers.respond_json(ctx, {'errors': errors, 'html': form_html})
        else:
            return templates.render(ctx, '/index.mako', root_question = root_question)
    if api_data is not None:
        user_api_data.update(api_data)
        current_test_case.api_data = user_api_data
        current_test_case.save(safe = True)
    return wsgihelpers.respond_json(ctx, None) if req.is_xhr else wsgihelpers.redirect(ctx, location = '')


def update_session(ctx):
    session = ctx.session
    if session is None:
        session = model.Session()
        session.anonymous_token = uuidhelpers.generate_uuid()
        session.token = uuidhelpers.generate_uuid()
    if session.user is None:
        user = model.Account(_id = objectid.ObjectId())
        user.compute_words()
        user.save(safe = True)
        session.user = user
    session.expiration = datetime.datetime.utcnow() + datetime.timedelta(hours = 4)
    session.save(safe = True)
    ctx.session = session
