const sounds = {}

export function useSFX() {

    function playSound(soundName) {


        if(!Object.hasOwn(sounds, soundName)) {
            const audio = new Audio(`/SFX/${soundName}.mp3`)

            audio.onerror = () => {
                console.error(`SFX Error: The audio file "/SFX/${soundName}.mp3" could not be loaded or does not exist.`);
                delete sounds[soundName]
            }

            sounds[soundName] = audio
        }

        let sound = sounds[soundName]
         
        sound.currentTime = 0
        sound.play().catch((error) => {
            console.warn("SFX ERROR: Audio playback was blocked by the browser until user interaction:", error)
        })
    }

    return { playSound }
}