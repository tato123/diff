'use strict';
const defaultScript = 'https://storage.googleapis.com/diff-exp-js/runner.js';
const reservation = require('./reservation');

const shortid = require('shortid');
const appsId = 'experiments-224320';

const createVersionHandler = async (appengine, reverseProxyServerVersion = 'reverse-proxy', injectScript = defaultScript) => {

    const versionId = 'p-'+shortid.generate().toLowerCase();
    console.log('versionId', versionId);

    const appYaml = {
        id: versionId,
        runtime: "nodejs10",
        env: "standard",
        instance_class: "B4",
        basicScaling: {
            maxInstances: 1
        },
        deployment: {
            zip: {
                sourceUrl: 'https://storage.googleapis.com/proxy-template-staging/reverse-proxy.zip'
            }
        },
        envVariables: {
            SCRIPT_URL: injectScript
        }
    }

    console.log('attempting to create a new version')
    const response = await appengine.apps.services.versions.create({
        appsId,
        servicesId: 'tester',
        requestBody: appYaml
    })
    console.log('created a new version succesfully, recording...');

    const url = `https://${versionId}-dot-tester-dot-experiments-224320.appspot.com/`;
    await reservation.createReservation(versionId, url);

    console.log('recoreded reservation');

    return Object.assign({}, response.data, {
        versionId,
        url
    });
}


const listVersions = async (appengine) => {
    const response = await appengine.apps.services.list({
        appsId,        
    })

    return response.data;

}

module.exports = {
    createVersionHandler,
    listVersions
}

