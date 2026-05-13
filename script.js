// ========================================
// CONFIGURAÇÃO DO SUPABASE
// ========================================
const SUPABASE_URL = 'sb_publishable_JfN-ETjKtgrwQRy-cSW7oA_d_uE2dp2';     // Cole sua URL
const SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImljdHRobWluZmtvbGl2c3Bxd3h5Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3Nzg2NzM1MzYsImV4cCI6MjA5NDI0OTUzNn0.-3hvQZ0kCQCeTbZUZcHqSBmFJj7KVZ8_E-vkfMRuVEk';              // Cole sua chave

const supabase = window.supabase.createClient(SUPABASE_URL, SUPABASE_ANON_KEY);
const BUCKET_NAME = 'musicas';  // Nome do bucket que você criou

let playlist = [];
let currentIndex = 0;
let shuffle = false;
const player = document.getElementById('main-player');

// ========================================
// INICIALIZAÇÃO
// ========================================
document.addEventListener('DOMContentLoaded', () => {
    // Carregar tema salvo
    const savedTheme = localStorage.getItem('selectedTheme');
    if(savedTheme) setTheme(savedTheme);
    
    // Carregar estado do shuffle
    const savedShuffle = localStorage.getItem('shuffle');
    if(savedShuffle === 'true') toggleShuffle();
    
    // Carregar músicas do Supabase (em vez do playlist.json)
    loadSongsFromSupabase();
    
    // Salvar progresso periodicamente
    setInterval(() => {
        if(!player.paused && player.currentTime && playlist.length) {
            localStorage.setItem('savedTime', player.currentTime);
            localStorage.setItem('savedTrack', currentIndex);
        }
    }, 5000);
});

// ========================================
// BUSCAR MÚSICAS DO SUPABASE
// ========================================
async function loadSongsFromSupabase() {
    try {
        // Listar todos os arquivos do bucket
        const { data: files, error: listError } = await supabase
            .storage
            .from(BUCKET_NAME)
            .list('');  // Lista na raiz do bucket
        
        if (listError) throw listError;
        
        console.log('Arquivos encontrados:', files);
        
        // Para cada arquivo .mp3, criar URL pública
        const songs = [];
        for (const file of files) {
            if (file.name.endsWith('.mp3')) {
                // Pega a URL pública do arquivo
                const { data: publicUrl } = supabase
                    .storage
                    .from(BUCKET_NAME)
                    .getPublicUrl(file.name);
                
                // Extrai título do nome do arquivo (remove .mp3)
                const title = file.name.replace('.mp3', '').replace(/_/g, ' ');
                
                songs.push({
                    title: title,
                    artist: 'Artista Desconhecido',  // Você pode extrair de metadados depois
                    url: publicUrl.publicUrl,
                    cover: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/25.png',
                    filename: file.name
                });
            }
        }
        
        playlist = songs;
        renderPlaylist();
        
        if (playlist.length > 0) {
            loadTrack(0);
        } else {
            console.log('Nenhuma música encontrada no bucket');
        }
        
    } catch (error) {
        console.error('Erro ao carregar músicas:', error);
    }
}

// Função para enriquecer dados da música (opcional - de um JSON separado)
async function enrichWithMetadata() {
    try {
        const response = await fetch('metadata.json');
        const metadata = await response.json();
        
        // Atualiza artistas e capas baseado no nome do arquivo
        playlist = playlist.map(song => {
            const meta = metadata[song.filename];
            if (meta) {
                return {
                    ...song,
                    artist: meta.artist || song.artist,
                    cover: meta.cover || song.cover
                };
            }
            return song;
        });
        
        renderPlaylist();
    } catch (error) {
        console.log('Nenhum metadata encontrado, usando dados padrão');
    }
}

// ========================================
// FUNÇÕES DO PLAYER (mesmas de antes)
// ========================================
function renderPlaylist() {
    const menu = document.getElementById('playlist-menu');
    if (!menu) return;
    
    menu.innerHTML = playlist.map((song, i) => `
        <li onclick="loadTrack(${i})" class="cursor-pointer hover:accent-color flex items-center gap-2 p-2 rounded hover:bg-white/10">
            <i class="fa-solid fa-music text-xs"></i>
            <span class="truncate">${song.title}</span>
            ${i === currentIndex ? '<i class="fa-solid fa-play text-xs ml-auto"></i>' : ''}
        </li>
    `).join('');
}

function loadTrack(index) {
    if (index < 0 || index >= playlist.length) return;
    
    currentIndex = index;
    const song = playlist[index];
    const player = document.getElementById('main-player');
    
    player.src = song.url;
    document.getElementById('track-title').innerText = song.title;
    document.getElementById('track-artist').innerText = song.artist;
    document.getElementById('cover-art').src = song.cover;
    
    renderPlaylist();
    
    if (!player.paused) player.play();
}

// ========================================
// INICIALIZAR
// ========================================
document.addEventListener('DOMContentLoaded', () => {
    loadSongsFromSupabase();
});

// ========================================
// CONTROLES DO PLAYER
// ========================================
function togglePlay() {
    const btn = document.getElementById('play-btn');
    if (player.paused) {
        player.play();
        btn.innerHTML = '<i class="fa-solid fa-pause"></i>';
    } else {
        player.pause();
        btn.innerHTML = '<i class="fa-solid fa-play ml-1"></i>';
    }
}

function next() {
    if(shuffle && playlist.length > 1) {
        let newIndex = currentIndex;
        while(newIndex === currentIndex) {
            newIndex = Math.floor(Math.random() * playlist.length);
        }
        currentIndex = newIndex;
    } else {
        currentIndex = (currentIndex + 1) % playlist.length;
    }
    loadTrack(currentIndex);
    player.play();
}

function prev() {
    currentIndex = (currentIndex - 1 + playlist.length) % playlist.length;
    loadTrack(currentIndex);
    player.play();
}

function seek(e) {
    const rect = e.target.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const pct = x / rect.width;
    player.currentTime = pct * player.duration;
}

// ========================================
// PROGRESSO E TEMPO
// ========================================
function updateProgress() {
    if(player.duration) {
        const progress = (player.currentTime / player.duration) * 100;
        document.getElementById('progress-bar').style.width = `${progress}%`;
        document.getElementById('current-time').innerText = formatTime(player.currentTime);
        document.getElementById('total-duration').innerText = formatTime(player.duration);
    }
}

function formatTime(secs) {
    if(isNaN(secs)) return '0:00';
    const min = Math.floor(secs / 60);
    const s = Math.floor(secs % 60);
    return `${min}:${s < 10 ? '0' : ''}${s}`;
}

// ========================================
// TEMAS
// ========================================
function setTheme(theme) {
    document.body.className = `h-screen flex flex-col overflow-hidden theme-${theme}`;
    localStorage.setItem('selectedTheme', theme);
    
    const card = document.getElementById('now-playing-card');
    switch(theme) {
        case 'apple':
            card.style.borderRadius = '30px';
            break;
        case 'soundcloud':
            card.style.borderRadius = '0px';
            break;
        default:
            card.style.borderRadius = '12px';
    }
}

// ========================================
// SHUFFLE (ALEATÓRIO)
// ========================================
function toggleShuffle() {
    shuffle = !shuffle;
    const btn = document.getElementById('shuffle-btn');
    if(btn) {
        btn.style.opacity = shuffle ? '1' : '0.5';
        btn.style.transform = shuffle ? 'scale(1.1)' : 'scale(1)';
    }
    localStorage.setItem('shuffle', shuffle);
}

// ========================================
// MOBILE SIDEBAR (OPCIONAL)
// ========================================
function toggleSidebar() {
    const sidebar = document.getElementById('sidebar');
    if(sidebar) {
        sidebar.classList.toggle('hidden');
    }
}