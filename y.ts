
enum ToggleEnum {
    //%block="On"
    On,
    //%block="Off"
    Off
}

//% block="Toggle"
//% color=#66CC66
//% icon=""
//% weight=85
namespace toggle {
    let selectedToggle: Sprite = null;
    let toggleBases: Sprite[] = [];
    let togglesTexts: Sprite[] = []; // Array to store text sprites for slider values
    let sliderOrientations: boolean[] = [];
    let movingA = false;
    let toggleToggle: boolean[] = [];
    let toggleKnobs: Sprite[] = [];
    let c = 0
    //% block="create toggle of color $color and toggle color $linecolor"
    //% blockSetVariable=Toggle
    //% group="Create"
    //% color.shadow="colorindexpicker"
    //% linecolor.shadow="colorindexpicker"
    export function createSlider3(color: number, linecolor: number): Sprite {
        let sliderIndex = toggleBases.length;

        // Create the bar for the slider (default: horizontal)
        let baseImage = image.create(50, 20);
        baseImage.fill(color);
        let toggleBase = sprites.create(baseImage, SpriteKind.Player);
        toggleBases.push(toggleBase);

        // Position the knob at the leftmost position of the bar
        toggleBase.setPosition(80, 60); // Default position

        // make the square
        let knobImage = image.create(25,20)
        knobImage.drawRect(0,0,25,20,linecolor)
        let toggleKnob = sprites.create(knobImage, SpriteKind.Player)
        toggleKnobs.push(toggleKnob)

        toggleKnob.setPosition(toggleBase.x - 12,toggleBase.y)
        
        // make the text

        // Create a renderable text that will follow the slider
        let toggleText = sprites.create(image.create(1, 1), SpriteKind.Player); // Create empty sprite for text
        togglesTexts.push(toggleText); // Store the text sprite
        let toggleText2 = sprites.create(image.create(1, 1), SpriteKind.Player); // Create empty sprite for text
        togglesTexts.push(toggleText2); // Store the text sprite

        scene.createRenderable(100, function (ctx) {
            let text = "On";
            let text2 = "Off"
            // Create text above the slider
            toggleText.setImage(image.create(text.length * 8, 8));
            toggleText2.setImage(image.create(text.length * 8, 8));
            toggleText.image.fill(0);  // Clear the image to create new text
            toggleText2.image.fill(0)
            toggleText.image.print(text, 0, 0);
            toggleText2.image.print(text2, 0, 0)
            toggleText.setPosition(toggleBase.x - 13, toggleBase.y);  // Position the text above the slider
            toggleText2.setPosition(toggleBase.x + 10, toggleBase.y);
        });

        return toggleKnob,toggleBase;
    }
    //% block="set $toggle position to X $x Y $y"
    //% group="Functions"
    //% toggle.shadow=variables_get
    export function setSliderPosition3(toggle: Sprite, x: number, y: number): void {
        let index = toggleBases.indexOf(toggle);
        if (index != -1) {
            let toggleBase = toggleBases[index];
            let toggleKnob = toggleKnobs[index]

            toggleBase.setPosition(x, y);
            toggleKnob.setPosition(toggleBase.x - 12,toggleBase.y)

            
        }
    }
    //%toggle.shadow=variables_get
    //%block
    export function control(toggle: Sprite): void {
        selectedToggle = toggle
    }
    let toggleStates: boolean[] = []; // Store state for each toggle

    controller.A.onEvent(ControllerButtonEvent.Pressed, function () {
        if (selectedToggle) {
            let index = toggleBases.indexOf(selectedToggle);
            if (index != -1) {
                let toggleKnob = toggleKnobs[index];
                let toggleBase = toggleBases[index];

                // Ensure we have a state for this toggle
                if (toggleStates[index] == undefined) {
                    toggleStates[index] = false; // Default to false
                }

                if (toggleStates[index] == false) {
                    toggleKnob.x = toggleBase.x + 13;
                    toggleStates[index] = true;
                } else {
                    toggleKnob.x = toggleBase.x - 12;
                    toggleStates[index] = false;
                }
            }
        }
    });
    controller.A.onEvent(ControllerButtonEvent.Released, function() {
        movingA = false
    })
    //%block="is $toggle value equal $boolea"
    //%toggle.shadow=variables_get
    //%boolea.shadow="toggleOnOff"
    export function getToggleValue(toggle: Sprite, boolea: boolean): boolean {
        let index = toggleBases.indexOf(toggle);
        if (index != -1) {
            if (boolea === false) {
            return toggleStates[index]; // Return the stored state or false if undefined
            }else {
                return !toggleStates[index];
            }
        }
        return undefined;
    }
    //Cycling through the sliders
    //%block="Cycle through toggles"
    export function cycleToNextSlider(): void {
        c === 1
    if (toggleBases.length = 0) return; // No sliders exist
    // If no slider is selected, start from the first one
    if (!selectedToggle) {
        selectedToggle = toggleBases[0];
} else {
       
            // Get the current index and cycle to the next slider
            let index = toggleBases.indexOf(selectedToggle);
            if (index != -1) {
                index++
                if (index >= toggleBases.length) {
                index = 0; // If we reach the end, cycle back to the first one
            }
            selectedToggle = toggleBases[index];
        }
    }
}
    controller.B.onEvent(ControllerButtonEvent.Pressed, function() {
        if (selectedToggle !== null) {
    cycleToNextSlider(); // Trigger slider cycl
        }
})
    //%block="Destroy $toggle"
    //%toggle.shadow=variables_get
    //%boolea.shadow="toggleOnOff"
    export function destroy(toggle: Sprite): void {
        let index = toggleBases.indexOf(toggle);
        if (index != -1) {
            let toggleBase = toggleBases[index];
            let toggleKnob = toggleKnobs[index]
            toggleBase.destroy()
            toggleKnob.destroy()
            let toggleText = togglesTexts[index];
            if (toggleText) {
                toggleText.destroy();
                togglesTexts.splice(index, 1);  // Remove the text sprite from the array
            }
            let toggleText2 = togglesTexts[index];
            if (toggleText2) {
                toggleText2.destroy();
                togglesTexts.splice(index, 1);  // Remove the text sprite from the array
            }

            
        }
    }
}