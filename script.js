// molecular weights of the elements in g/mol
let atomicWeights = {};

// load data from json
window.onload = async () => {
    await loadAtomicWeights();
}

async function loadAtomicWeights() {
    try {
        const response = await fetch('elements.json');
        atomicWeights = await response.json();
        console.log("Atomic weights loaded successfully:", atomicWeights);
    } catch (error) {
        console.error("Error loading atomic weights:", error);
    }
}

function formatSubscript(input) {
    const subscriptNumbers = {
        "0": "₀", "1": "₁", "2": "₂", "3": "₃", "4": "₄",
        "5": "₅", "6": "₆", "7": "₇", "8": "₈", "9": "₉"
    }
    return input.replace(/\d/g, (digit) => subscriptNumbers[digit]);
}

// function to write the molecular weight
function writeMolecularWeight() {
    let molecule = document.getElementById("molecule").value.trim().replace(/\s/g,'');
    const resultDiv = document.getElementById("result");

    if (molecule === "") {
        resultDiv.textContent = "Please enter a molecule.";
        return;
    }

    try {
        let output = computeWeight(molecule)
        const molecularWeight = output[0];
        const formula = output[1]
        resultDiv.textContent = 
        `Molecular Weight of ${formatSubscript(formula)} is ${(molecularWeight).toFixed(4)} g/mol`;
    } catch (error) {
        resultDiv.textContent = error.message;
    }
}

// helper function to calculate the molecular weight
function computeWeight(molecule) {
    let i = 0;
    let totalWeight = 0;
    let formula = "";
    let brackets = false;
    let bracketWeight = 0;

    while (i < molecule.length) {
        let n = "";
        let element = molecule[i];

        if (element === "(") {
            formula += element;
            brackets = true;
            i += 1;
            continue;
        }

        if (i != molecule.length - 1) {
            // if element is lowercase
            if (molecule[i + 1] != molecule[i + 1].toUpperCase()) {
                element += molecule[i + 1];
                i += 1;
            }
        }

        // while molecule[i + 1] is a decimal
        while (i != molecule.length - 1 && !isNaN(molecule[i + 1])) {
            n += molecule[i + 1];
            i += 1
        }

        if (n === "") {
            n = Number(1);
        } else{
            n = Number(n);
        }
        
        i += 1;
        
        if (element === ")") {
            brackets = false;
            totalWeight += bracketWeight * n;
            bracketWeight = 0;
            i += 1;
        }

        element = element[0].toUpperCase() + element.slice(1);
        if (n != 1) {
            formula += element + String(n);
        } else {
            formula += element
        }

        if (element in atomicWeights){
            if (brackets === true) {
                bracketWeight +=  atomicWeights[element] * n
            } else {
                totalWeight += atomicWeights[element] * n;
            }
            console.log(element, n,"*", atomicWeights[element], atomicWeights[element] * n);
        } else if (!(element === "(" | element === ")")) {
            throw new Error(`Unknown element: ${element}`);
        }
        
    }
    return [totalWeight, formula];
}
