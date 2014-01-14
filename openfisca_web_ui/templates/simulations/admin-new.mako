## -*- coding: utf-8 -*-


## OpenFisca -- A versatile microsimulation software
## By: OpenFisca Team <contact@openfisca.fr>
##
## Copyright (C) 2011, 2012, 2013, 2014 OpenFisca Team
## https://github.com/openfisca
##
## This file is part of OpenFisca.
##
## OpenFisca is free software; you can redistribute it and/or modify
## it under the terms of the GNU Affero General Public License as
## published by the Free Software Foundation, either version 3 of the
## License, or (at your option) any later version.
##
## OpenFisca is distributed in the hope that it will be useful,
## but WITHOUT ANY WARRANTY; without even the implied warranty of
## MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
## GNU Affero General Public License for more details.
##
## You should have received a copy of the GNU Affero General Public License
## along with this program.  If not, see <http://www.gnu.org/licenses/>.


<%!
from openfisca_web_ui import conf, model, urls
%>


<%inherit file="/site.mako"/>
<%namespace name="edit" file="admin-edit.mako"/>


<%def name="breadcrumb_content()" filter="trim">
            <%parent:breadcrumb_content/>
            <li><a href="${model.Simulation.get_admin_class_url(ctx)}">${_(u"Simulations")}</a></li>
            <li class="active">${_(u'New')}</li>
</%def>


<%def name="container_content()" filter="trim">
        <form action="${model.Simulation.get_admin_class_url(ctx, 'new')}" method="post" role="form">
            <%edit:hidden_fields/>
            <fieldset>
                <legend>${_(u"Creation of Simulation")}</legend>
                <%self:error_alert/>
                <%edit:form_fields/>
                <button class="btn btn-primary" name="submit" type="submit"><span class="glyphicon glyphicon-ok"></span> ${_('Create')}</button>
            </fieldset>
        </form>
</%def>


<%def name="css()" filter="trim">
        <%edit:css/>
</%def>


<%def name="scripts()" filter="trim">
        <%edit:scripts/>
</%def>


<%def name="title_content()" filter="trim">
${_(u'New Simulation')} - ${parent.title_content()}
</%def>
