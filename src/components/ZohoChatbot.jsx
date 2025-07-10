import { useEffect } from 'react';

const ZohoChatbot = () => {
    useEffect(() => {
        const loadChatbot = () => {
            if (document.getElementById('zsiqscript')) {
                return;
            }

            const initScript = document.createElement('script');
            initScript.innerHTML =
                "window.$zoho=window.$zoho || {}; $zoho.salesiq=$zoho.salesiq||{ready:function(){}}";
            document.body.appendChild(initScript);

            const script = document.createElement('script');
            script.id = 'zsiqscript';
            script.src = 'https://salesiq.zohopublic.com/widget?wc=siq71970f10e365e04683427dd7a1403b1f7de7ff75c1aeca664d0f18dd0dfa44d3';
            script.defer = true;
            document.body.appendChild(script);
        };

        const handleClick = () => {
            loadChatbot();
            document.removeEventListener('click', handleClick);
        };

        document.addEventListener('click', handleClick);
        return () => document.removeEventListener('click', handleClick);
    }, []);

    return null;
};

export default ZohoChatbot;