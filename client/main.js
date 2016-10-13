import { Template } from 'meteor/templating';
import { Meteor } from 'meteor/meteor';

import '../imports/ui/login/login.js';
import '../imports/ui/dashboard/dashboard.js';

Meteor.startup(() => {
    Uploader.uploadUrl = Meteor.absoluteUrl("upload"); // Cordova needs absolute URL
});

Template.registerHelper('formatDate', function(date) {
    return moment(date).format('DD/MM/YYYY hh:mm:ss');
});

Template.registerHelper('lastOccurrence', function(object) {
	if (typeof object !== 'undefined') {
    	return (typeof object[(object.length-1)] !== 'undefined') ? object[(object.length-1)].occurrence : [];
	}
	return;
});


Template.registerHelper('requestStatus', function(status) {

    var labelClass = '';

    switch (status) {
        case 'Processando':
            labelClass = 'info';
            break;

        case 'Aguardando aprovação':
            labelClass = 'warning';
            break;

        case 'Finalizado com sucesso':
            labelClass = 'success';
            break;

        case 'Finalizado sem sucesso':
            labelClass = 'danger';
            break;

        default:
            labelClass = 'primary';
            break;
    }
    
    return '<span class="label label-' + labelClass + '">' + status + '</span>';
});
