window.onload = function() {
    let WHITERICE = document.getElementById(`whiteRice`);
    let CALRICE = document.getElementById(`caliRice`);
    let WHITERECIPE = document.getElementById(`whiteRecipe`);
    let CALRECIPE = document.getElementById(`calRecipe`);
    let ERROR = document.getElementById(`error`);
    let SELECTION = `white`;

    function setWhite (cup) {
        document.getElementById(`wCups`).textContent = cup;
        document.getElementById(`wWater`).textContent =
        Math.round((cup * 2)*100)/100;
    }

    function setCali (cup) {
        document.getElementById(`cCups`).textContent = cup;
        document.getElementById(`cWater`).textContent =
        Math.round((cup * 1.6)*100)/100;
    }

    function isNumeric(str) {
        if(typeof str !== `string`) return false;
        return !isNaN(str) && !isNaN(parseFloat(str)) && str > 0;
    }

    document.getElementById(`userInput`).addEventListener(`keyup`, listener, false);
    function listener() {
        let cup = document.getElementById(`userInput`).value;
        ERROR.classList.add(`hider`);
        if (!isNumeric(cup)) {
            ERROR.classList.remove(`hider`);
            WHITERECIPE.classList.add(`hider`);
            CALRECIPE.classList.add(`hider`);
        }
        else {
            if (SELECTION === `white`) {
                CALRECIPE.classList.add(`hider`);
                WHITERECIPE.classList.remove(`hider`);
                setWhite(cup);
            }
            else if (SELECTION === `cali`) {
                WHITERECIPE.classList.add(`hider`);
                CALRECIPE.classList.remove(`hider`);
                setCali(cup);
            }
        }

        WHITERICE.onclick = () => {
            console.log(`white`);
            SELECTION = `white`;
            listener();
        };

        CALRICE.onclick = () => {
            console.log(`CALI`);
            SELECTION = `cali`;
            listener();
        };

        const STOP = document.getElementById(`userInput`).value.length;
        document.getElementById(`userInput`).setSelectionRange(STOP, STOP);
        document.getElementById(`userInput`).focus();
    }
};
