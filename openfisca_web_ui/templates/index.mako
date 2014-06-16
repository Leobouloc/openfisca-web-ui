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
from openfisca_web_ui.templates import helpers
%>


<%inherit file="site.mako"/>


<%def name="appconfig_script()" filter="trim">
window.appconfig = ${helpers.index_appconfig(ctx) | n, js};
</%def>


<%def name="breadcrumb()" filter="trim">
</%def>


<%def name="container_content()" filter="trim">
<div id="simulator-container"></div>
</%def>


<%def name="css()" filter="trim">
    <%parent:css/>
    <link href="${urls.get_url(ctx, u'css/chart.css')}" media="screen" rel="stylesheet">
</%def>
