import { Meteor } from 'meteor/meteor';
import '../imports/api/requests.js';

Meteor.startup(() => {
    UploadServer.init({
        tmpDir: process.env.PUBLIC + '/.uploads/tmp',
        uploadDir: process.env.PUBLIC + '/.uploads/',
        checkCreateDirectories: true //create the directories for you
    });
});
