import { Template } from 'meteor/templating';

import '../imports/ui/login/login.js';
import '../imports/ui/dashboard/dashboard.js';

Template.registerHelper('formatDate', function(date) {
  return moment(date).format('DD/MM/YYYY hh:mm:ss');
});

Template.registerHelper('requestStatus', function (status) {
	switch (status) {
		case 'Processando':
			return '<span class="label label-info">'+status+'</span>';
		break;

		case 'Aguardando aprovação':
			return '<span class="label label-warning">'+status+'</span>';
		break;

		case 'Finalizado com sucesso':
			return '<span class="label label-success">'+status+'</span>';
		break;

		case 'Finalizado sem sucesso':
			return '<span class="label label-danger">'+status+'</span>';
		break;

		default:
			return '<span class="label label-info">'+status+'</span>';
		break;
	}
});
