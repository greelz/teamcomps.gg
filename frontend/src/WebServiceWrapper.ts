export async function makeWebServerRequest(url: string, bodyValue: object): Promise<any> {
    const data = await fetch(url, {
        method: 'POST',
        mode: 'cors',
        cache: 'no-cache',
        credentials: 'same-origin',
        headers: {
          'Content-Type': 'application/json'
        },
        redirect: 'follow',
        referrerPolicy: 'no-referrer',
        body: JSON.stringify(bodyValue),
      });
    
    return await data.json();
}