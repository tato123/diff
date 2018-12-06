const { getXDWrapper } = require("xd-json-wrapper");

const {Rectangle, Color} = require("scenegraph"); 

function exportJson(selection) { 
    
    let xdNodes = null;
    if (Array.isArray(selection.items)) {
        xdNodes = selection.items.map(item => getXDWrapper(item).toJSON())        
    }
    const output = {
        nodes: xdNodes
    }
    console.log(JSON.stringify(output))
}

module.exports = {
    commands: {
        exportJson: exportJson
    }
};