const createVersion = (name, version='reverse-proxy', targetKey, scriptKey ) => {
    const appYaml = {
        "id": name,
        "runtime": "nodejs10",
        "env": "standard",
        "instance_class": "B4",
        "manual_scaling": {
           "instances": 1
        },
        "deployment" : {
            "zip" : {
                "sourceUrl": `https://storage.googleapis.com/proxy-template-staging/${version}.zip`
            }
        },
        "envVariables": {
            "TARGET": targetKey,
            "SCRIPT_URL" : scriptKey
        }
     }

    fetch(`https://appengine.googleapis.com/v1/apps/experiments-224320/services/tester/versions`, {
        method: 'POST',
        data: appYaml
    }).then(response => {
        // handle the response
    }).catch(err => {
        // handle the error
    })
}
