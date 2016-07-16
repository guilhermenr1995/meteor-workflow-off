import { Template } from 'meteor/templating';

import '../imports/ui/login/login.js';
import '../imports/ui/dashboard/dashboard.js';

Template.registerHelper('formatDate', function(date) {
  return moment(date).format('DD/MM/YYYY H:MM:SS');
});
