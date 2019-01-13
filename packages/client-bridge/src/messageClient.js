export default () => {
    window.addEventListener('message', (evt) => {
        const data = evt.data;
    
        if(data.type === 'getDiff') {
            const data = window.getDeltas();
            window.parent.postMessage({
                type:'getDiff_response',
                source: 'getDiff-client',
                payload: data
            }, '*')
        }
    })
}
