const $  = document.querySelector.bind(document);
const $$  = document.querySelectorAll.bind(document);

const player = $('.player')
const playList = $('.playlist');
const cd = $('.cd');
const cdThumb = $('.cd-thumb');

const heading  = $('header h2');
const audio = $('#audio')


const repeatBtn = $('.btn-repeat')
const prevBtn = $('.btn-prev')
const playBtn = $('.btn-toggle-play')
const nextBtn = $('.btn-next')
const randomBtn = $('.btn-random')
const progress = $('.progress')


const app = {
    currentIndex : 0,
    isPlaying : false,
    isRotate: false,
    isRandom: false,
    isRepeat: false,
    songs: [
        {
            name: 'They said',
            rapper : 'Binz',
            image : './assets/img/Binz.jpg',
            path: './assets/audio/song-1-theysaid.mp3'
        },
        {
            name: 'Yêu 5',
            rapper : 'Rhymastic',
            image : './assets/img/Rhymastic.jpg',
            path: './assets/audio/song-2-yeu5.mp3'
        },
        {
            name: 'Học',
            rapper: 'DSK',
            image: './assets/img/DSK.jpg',
            path: './assets/audio/song-4-hoc.mp3'
        },
        {
            name: 'Run away',
            rapper: 'YC',
            image: './assets/img/YC.jpg',
            path: './assets/audio/song-5-runaway.mp3'
        },
        {
            name: 'Thằng điên',
            rapper: 'JayTee',
            image: './assets/img/Justatee.jpg',
            path: './assets/audio/song-6-thangdien.mp3'
        },
        {
            name: 'Chiếc điện thoại thần kỳ',
            rapper: 'Cô Ngốc',
            image: './assets/img/Congoc.jpg',
            path: './assets/audio/song-7-legend.mp3'
        },
        {
            name: 'EDM',
            rapper: 'Hoaprox',
            image: './assets/img/Hoaprox.jpg',
            path: './assets/audio/song-8-hoaprox.mp3'
        },
    ],

    render: function(){
        const htmls = this.songs.map((song, index) => {
            return `
            <div class="song ${index === this.currentIndex ? 'active': ''}" data-set="${index}">
                <div class="thumb" style="background-image: url(${song.image})">
                </div>
                <div class="body">
                    <h3 class="title">${song.name}</h3>
                    <p class="author">${song.rapper}</p>
                </div>
                <div class="option">
                <i class="fas fa-ellipsis-h"></i>
                </div>
            </div>
            `
        })
        playList.innerHTML = htmls.join('');
    },

    scrollActiveSong: function(){
        setTimeout(()=>{
            $('.song.active').scrollIntoView({
                behavior: 'smooth',
                block: 'center',
            })
        },300)
    },

    handleEvents: function(){
        const _this = this;
        const cdRotate = cdThumb.animate([
            {transform: 'rotate(360deg)'}
        ],{
            duration: 10000,
            iterations: Infinity
        })
        cdRotate.pause();

        // Scroll event
        const cdWidth = cd.offsetWidth;
        document.onscroll = function(){
            const scrollTop = window.scrollY || document.documentElement.scrollTop;
            const newCdWidth = cdWidth - scrollTop ;
            cd.style.width = newCdWidth > 0 ? newCdWidth + 'px': 0;
            cd.style.opacity = newCdWidth / cdWidth;
        }
        

        // Click play button
        playBtn.onclick = function(){
            _this.isPlaying = !_this.isPlaying;
            _this.isRotate  = !_this.isRotate;
            if(_this.isPlaying){
                audio.play();
            }
            else{
                audio.pause();
            }
        }

        // Khi audio được chạy
        audio.onplay = function(){
            player.classList.add('playing');
            cdRotate.play();
        }

        // Khi audio được dừng
        audio.onpause = function(){
            player.classList.remove('playing');
            cdRotate.pause();
        }

        // Tua song
        progress.onchange = function(){
            const currentTime = audio.duration / 100 * progress.value;
            audio.currentTime = currentTime;
        }

        // Thumb progress di chuyển theo tiến độ bài hát
        audio.ontimeupdate = function(){
            if(audio.duration){
                const percentSong = Math.floor(audio.currentTime / audio.duration * 100);
                progress.value = percentSong;
            }
        }

        // Xử lý sự kiện audio kết thúc
        audio.onended = function(){
            if(_this.isRepeat){
                audio.play();
            }else{
               nextBtn.click();
            }
        }

        // Next song
        nextBtn.onclick = function(){
            if(_this.isRandom){
                _this.randomSong();
            }else{
                _this.nextSong();
            }
           audio.play();
           _this.render();
           _this.scrollActiveSong();
        }

        // Prev song
        prevBtn.onclick = function(){
            if(_this.isRandom){
                _this.randomSong();
            }else{
                _this.prevSong();
            }
            audio.play();
           _this.render();
           _this.scrollActiveSong();
        }

        // Click random songs
        randomBtn.onclick = function(){
            _this.isRandom  = !_this.isRandom;
            this.classList.toggle('active',_this.isRandom);
        }

        // Click repeat songs
        repeatBtn.onclick = function(){
            _this.isRepeat = !_this.isRepeat;
            this.classList.toggle('active', _this.isRepeat);
        }

        // Click songs
        playList.onclick = function(e){
           const songNode = e.target.closest('.song:not(.active)');
           if(songNode || !e.target.closest('.option')){
                if(songNode){
                    const newIndex = songNode.getAttribute('data-set');
                    _this.currentIndex = Number(newIndex);
                }
           }
           _this.loadCurrentSong();
           audio.play();
           _this.render();
        }
    },

    nextSong: function(){
        this.currentIndex++;
        if(this.currentIndex >= this.songs.length){
            this.currentIndex = 0;
        }
        this.loadCurrentSong();
    },

    prevSong: function(){
        this.currentIndex--;
        if(this.currentIndex < 0){
            this.currentIndex = this.songs.length - 1;
        }
        this.loadCurrentSong();
    },

    randomSong: function(){
        var newIndex;
        do{
            newIndex = Math.floor(Math.random() * this.songs.length);
        }
        while(newIndex == this.currentIndex);
        this.currentIndex = newIndex;
        this.loadCurrentSong();
    },

    loadCurrentSong: function(){
        const currentSong = this.songs[this.currentIndex];
        heading.textContent = `${currentSong.name}`;
        audio.src = `${currentSong.path}`;
        cdThumb.style.backgroundImage = `url(${currentSong.image})`
    },

    
    start: function(){
        // Xử lý các events
        this.handleEvents();

        this.loadCurrentSong();

        this.render();
    }
}

app.start();