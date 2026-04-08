# 🎵 Projeto: Multiverse Music Player - O Guia do Duelista

Este documento explica o funcionamento técnico do seu site de músicas usando analogias do mundo dos animes, jogos e animações da Disney. Prepare seu deck e escolha seu Pokémon inicial!

---

## 1. O HTML (O Corpo do Baymax / A Base do Castelo da Disney)
O arquivo `index.html` é a estrutura física do nosso projeto. Imagine que ele é o **Baymax (Operação Big Hero)** sem sua armadura: funcional, mas precisa de "skins" para diferentes missões.

- **Os Botões de Tema:** Funcionam como **Pedras de Evolução (Pokémon)**. Ao clicar em "Spotify", o site usa uma *Pedra do Trovão* e assume tons escuros e verdes. Ao clicar em "Apple", ele usa uma *Pedra do Sol* e fica brilhante e minimalista.
- **O Player:** É o seu **D-Terminal (Digimon)**. Ele é a interface de comunicação entre você e os dados que vêm do "Mundo Digital" (sua pasta no GitHub).

## 2. O CSS & Tailwind (A Armadura de Clair Obscure & Estilo Disney)
Usamos **Tailwind CSS** para que o site mude de forma instantânea.
- **Sombras (Clair Obscure):** Adicionamos sombras profundas no player para dar aquele clima de mistério e elegância visto em *Clair Obscure: Expedition 33*.
- **Transições:** Quando você troca o tema, o site não dá um "pulo". Ele desliza suavemente como a transformação da **Cinderela** ou da **Elsa** cantando "Let it Go".

## 3. O JavaScript (A Lógica do Duelo / Estratégia de LOL)
O código em `<script>` é o cérebro. É aqui que o jogo acontece.
- **Função `loadTrack`:** Funciona como invocar uma carta em **Yu-Gi-Oh!**. Quando você clica numa música, o código grita: *"Eu invoco a Música X em modo de ataque!"*. O player limpa o campo e coloca a nova melodia em cena.
- **Controle de Progresso:** É como a barra de vida (HP) de um campeão de **League of Legends**. Conforme o tempo passa, a barra de progresso avança. Se você clicar nela, você está dando um *Flash* para outro momento da música.
- **Loop de Playlist:** Se a música acaba e pula para a próxima, é o efeito passivo de um item no **Backpack Battle** que ativa automaticamente ao final do turno.

## 4. O JSON (A Mochila de Itens / O Deck de Cartas)
O arquivo `playlist.json` é o seu **Backpack (Backpack Battle)**.
- Cada música é um item dentro da sua mochila.
- Se você quiser adicionar uma nova música, basta abrir a mochila e colocar um novo objeto lá dentro. 
- O site vai ler essa mochila e organizar os itens (músicas) na prateleira para você usar.

---

## 5. Como subir para o GitHub (O Desafio da Elite dos 4)
Para o seu site funcionar e o mundo todo ver, siga estes passos:

1. **Crie o Repositório:** Chame de "meu-player-de-musica".
2. **Suba os arquivos:** Coloque o `index.html`, o `playlist.json` e a pasta `BANCO DE MÚSICAS`.
3. **Ative o GitHub Pages:** Vá em *Settings -> Pages* e ative o site.
4. **Link das Músicas:** No seu `playlist.json`, o link da música deve ser o caminho relativo, exemplo: `BANCO DE MÚSICAS/minha-musica.mp3`.

---

**"O futuro pertence àqueles que acreditam na beleza de seus sonhos... e em um código bem indentado."** - *Walt Disney (quase isso)*

**"Amanhã, o sol brilhará sobre um novo player de música!"** - *Tai (Digimon Adventure)*
