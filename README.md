# Chatbot de Conhecimento - Spin Engenharia

Este projeto é a implementação de um chatbot com interface moderna em React, projetado para se conectar a uma base de conhecimento na plataforma Dify.ai. O objetivo é fornecer um assistente virtual especialista, capaz de responder perguntas técnicas sobre o software Action.net, utilizando manuais e documentos como fonte de dados.

A interface inclui funcionalidades de gerenciamento de conversas, permitindo criar, renomear, deletar e alternar entre diferentes sessões de chat.

## Guia de Execução Completo (Passo a Passo)

Siga esta lista de passos na ordem exata para configurar e rodar o projeto do zero.

1.  **Abra seu terminal** (como o PowerShell ou Git Bash) e clone o repositório para a sua máquina:
    ```bash
    git clone [https://github.com/4isaque4/Spin-Engenharia.git](https://github.com/4isaque4/Spin-Engenharia.git)
    ```

2.  **Navegue para a pasta** do projeto que acabou de ser criada:
    ```bash
    cd Spin-Engenharia
    ```

3.  **Instale todas as dependências** do projeto com um único comando. Isso pode levar alguns minutos e vai criar a pasta `node_modules`.
    ```bash
    npm install
    ```

4.  **Crie o arquivo de configuração de ambiente.** Na pasta principal do projeto, crie um novo arquivo e nomeie-o exatamente como `.env`

5.  **Abra o arquivo `.env`** que você acabou de criar e cole o seguinte conteúdo dentro dele:
    ```
    VITE_DIFY_API_KEY="sua-chave-secreta-do-dify-aqui"
    VITE_DIFY_API_URL="[https://api.dify.ai/v1/chat-messages](https://api.dify.ai/v1/chat-messages)"
    ```

6.  **Adicione sua chave de API do Dify.**
    - Vá até o site do [Dify.ai](https://dify.ai/).
    - Encontre sua chave secreta em `Visão Geral do App > Acesso à API > Segredo da API`.
    - Copie a chave e cole no arquivo `.env`, substituindo o texto `"sua-chave-secreta-do-dify-aqui"`.
    - Salve o arquivo `.env`.

7.  **Inicie a aplicação.** Este comando vai ligar o servidor de desenvolvimento.
    ```bash
    npm run dev
    ```

8.  **Abra o navegador** e acesse o endereço que apareceu no seu terminal. Geralmente será: `http://localhost:5173`.

Pronto! Seguindo estes passos em ordem, a aplicação estará configurada e rodando na sua máquina.

## Tecnologias Utilizadas

- **Front-end:** React (com Vite)
- **Plataforma de IA (Back-end):** [Dify.ai](https://dify.ai/)
- **Modelo de Linguagem (LLM):** Gemma
- **Estilização:** CSS3
- **Gerenciador de Pacotes:** npm