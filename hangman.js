var hangman = {
  /* [SPEL INSTÄLLNINGAR] */
  // Totalt antal tillåtna gissningar innan du hängs
  guesses : 6, 
  // Tillgängliga ord för att gissa.
  dictionary : ["flygplan", "arg", "handled", "storlek", "havre"], 

  /* [FLAGS] */
  // Nuvarande valda ordet
  word : null,
  // Ord Längd
  wordlen : 0,
  // Aktuellt antal korrekta ord
  rights : 0,
  // Nuvarande antal fel gissningar
  wrongs : 0,
  // HTML-referens till Hangman IMG
  elImg : null,
  // HTML-referens till ord DIV
  elWord : null,
  // HTML-referens till tecken DIV
  elChar : null,
  // HTML-referens till kvar liv
  elLives : null,

  init : function () {
  // init() : spelinitialisering

    //Skaffa HTML-element
    hangman.elImg = document.getElementById("hangman-img");
    hangman.elWord = document.getElementById("hangman-words");
    hangman.elChar = document.getElementById("hangman-char");
    hangman.elLives = document.getElementById("hangman-lives");


    // Generera tillgängliga tecken
    var charwrap = document.getElementById("hangman-char");
    for (var i=65; i<91; i++) {
      var charnow = document.createElement("input");
      charnow.type = "button";
      charnow.value = String.fromCharCode(i);
      charnow.disabled = true;
      charnow.addEventListener("click", hangman.check);
      charwrap.appendChild(charnow);
    }

    // Starta spelet
    hangman.reset();
    document.getElementById("hangman-reset").addEventListener("click", hangman.reset);
    document.getElementById("hangman-reset").disabled = false;
  },

  toggle : function (disable) {
  // toggle (): växla aktivera / inaktivera teckenval
  // PARAM inaktivera: aktivera eller inaktivera knappar

    var all = document.querySelectorAll("#hangman-char input");
    for (var i of all) {
      i.disabled = disable;
    }
  },

  reset : function () {
  // reset (): återställ spelet

    // Återställ dina stats
    hangman.rights = 0;
    hangman.wrongs = 0;
    hangman.elLives.innerHTML = hangman.guesses;
    hangman.elImg.style.opacity = 0;

    // Välj ett slumpmässigt ord från ordboken
    hangman.word = hangman.dictionary[Math.floor(Math.random() * Math.floor(hangman.dictionary.length))];
    hangman.word = hangman.word.toUpperCase();
    hangman.wordlen = hangman.word.length;

    // Rita ämnen
    hangman.elWord.innerHTML = "";
    for (var i=0; i<hangman.word.length; i++) {
      var charnow = document.createElement("span");
      charnow.innerHTML = "_";
      charnow.id = "hangword-" + i;
      hangman.elWord.appendChild(charnow);
    }

    // Aktivera kontroller
    hangman.toggle(false);
  },

  check : function () {
  // check() : kontrollera om det markerade tecknet finns i ordet

    // Sök efter träffar
    var index = 0, hits = [];
    while (index >= 0) {
      index = hangman.word.indexOf(this.value, index);
      if (index == -1) { break; }
      else { 
        hits.push(index);
        index++;
      }
    }

    // Visa träffarna + beräkna poäng
    if (hits.length > 0) {
      // Avslöja ord
      for (var hit of hits) {
        document.getElementById("hangword-" + hit).innerHTML = this.value;
      }

      // All hit - VINNA!
      hangman.rights += hits.length;
      if (hangman.rights == hangman.wordlen) {
        hangman.toggle(true);
        alert("YOU WON, GREAT JOB!");
      }
    } else {
      // Fel - slå av livet och visa galgen
      hangman.wrongs++;
      var livesleft = hangman.guesses - hangman.wrongs;
      hangman.elLives.innerHTML = livesleft;
      hangman.elImg.style.opacity = (1 - (livesleft/hangman.guesses)).toFixed(2);

      // Ta slut på gissningar: YOU LOST,TRY AGAIN!
      if (hangman.wrongs == hangman.guesses) {
        hangman.toggle(true);
        alert("YOU LOST,TRY AGAIN!");
      }
    }

    // Denna gör alla boktsäver man gissat på icke klickbara igen
    this.disabled = true;
  }
};

window.addEventListener("load", hangman.init);