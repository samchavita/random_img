// public/js/main.js

    // Load one on page load
    window.onload = loadNewImage;

    var ticking_audio = new Audio('ticking.mp3');

    let countdown;
    let imageTimeOut
    let duration = 60; // in seconds
    let timeLeft = duration;
    let isRunning = false;
    let startedTimer = false;



    function updateDisplay() {
      const minutes = Math.floor(timeLeft / 60);
      const seconds = timeLeft % 60;
      document.getElementById('timer').textContent = `00:${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`;
    }

    function timer_check() {
        if (timeLeft == 10) {
          document.getElementById('timer').classList.add('heartbeat');
        } 

        if (timeLeft <= 0) {
          clearInterval(countdown);
          isRunning = false;
          document.getElementById('timer').classList.remove('heartbeat');

          document.getElementById('play_button').style.display = 'none';
          document.getElementById('pause_button').style.display = 'none';
        }else {
          timeLeft--;
          updateDisplay();
        }
    }

    function start_timer() {

      if (isRunning) return; // Prevent multiple intervals

      document.getElementById('play_button').style.display = 'none';
      document.getElementById('pause_button').style.display = 'inline';

      isRunning = true;

      if (startedTimer){
        play_timer();
        return;
      }
      

      ticking_audio.currentTime = 0; // Reset audio to start
      startedTimer = true;

      ticking_audio.play().catch(err => console.error('Ticking audio play error:', err));
      document.getElementById('play_button').style.display = 'none';
      document.getElementById('pause_button').style.display = 'inline';

      countdown = setInterval(timer_check, 1000);
    }

    function play_timer() {

      ticking_audio.play();
      countdown = setInterval(timer_check, 1000);
      isRunning = true;
    }

    function pause_timer() {
      ticking_audio.pause();
      clearInterval(countdown);
      document.getElementById('play_button').style.display = 'inline';
      document.getElementById('pause_button').style.display = 'none';
      isRunning = false;
    }

    function reset_timer() {
      startedTimer = false;
      ticking_audio.pause();
      ticking_audio.currentTime = 0;

      clearInterval(countdown);
      timeLeft = duration;
      document.getElementById('play_button').style.display = 'inline';
      document.getElementById('pause_button').style.display = 'none';
      isRunning = false;
      updateDisplay();
    }

    // Optional: initialize display
    updateDisplay();

    function refreshImage(direction) {
        console.log(direction);
        if (imageTimeOut) {
            clearTimeout(imageTimeOut);
        }


        document.getElementById('randomImage').classList = ''; 
        if (direction === 'previous') {
            document.getElementById('randomImage').classList.add('scale-down-center-right');
        }
        if (direction === 'next') {
            document.getElementById('randomImage').classList.add('scale-down-center-left');
        }
        // document.getElementById('randomImage').classList.add('loading');

        imageTimeOut = setTimeout(() => {
            // document.getElementById('randomImage').classList.remove('scale-down');
            // document.getElementById('randomImage').classList.add('scale-up');

            document.getElementById('randomImage').classList = '';
            if (direction === 'previous') {
                document.getElementById('randomImage').classList.add('scale-up-left-center');
                loadPreviousImage();
            } else if (direction === 'next') {
                document.getElementById('randomImage').classList.add('scale-up-right-center');
                loadNewImage();
            }
        }, 400); // 0.5 seconds b
        // efore scaling down
    }

    async function loadNewImage() {
      reset_timer()

      try {
        const res = await fetch('/random-image');
        const imagePath = await res.text();
        document.getElementById('randomImage').src = imagePath + '?t=' + new Date().getTime(); // Prevent cache
      } catch (err) {
        alert('Error loading image');
        console.error(err);
      }
    }


    async function loadPreviousImage() {
      reset_timer()

      try {
        const res = await fetch('/previous-image');
        const imagePath = await res.text();
        console.log(imagePath);
        document.getElementById('randomImage').src = imagePath + '?t=' + new Date().getTime(); // Prevent cache
      } catch (err) {
        alert('No previous image found');
        console.error(err);
      }
    }