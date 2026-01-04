// Few-shot examples management module
// Handles structured input/output example pairs for few-shot prompting

/**
 * Parse few-shot examples from a text content string
 * Expected format:
 * Input: <input text>
 * Output: <output text>
 * ---
 * Input: <input text>
 * Output: <output text>
 * 
 * @param {string} content - Raw text content from the few_shot_examples card
 * @returns {Array<{input: string, output: string}>} Parsed examples array
 */
export function parseFewShotExamples(content) {
    if (!content || typeof content !== 'string') {
        return [];
    }

    const examples = [];
    const blocks = content.split(/---+/).map(b => b.trim()).filter(Boolean);

    for (const block of blocks) {
        const inputMatch = block.match(/Input\s*:\s*([\s\S]*?)(?=Output\s*:|$)/i);
        const outputMatch = block.match(/Output\s*:\s*([\s\S]*?)$/i);

        if (inputMatch && outputMatch) {
            examples.push({
                input: inputMatch[1].trim(),
                output: outputMatch[1].trim()
            });
        }
    }

    return examples;
}

/**
 * Format few-shot examples array back to text content
 * @param {Array<{input: string, output: string}>} examples - Examples array
 * @returns {string} Formatted text content
 */
export function formatFewShotExamples(examples) {
    if (!Array.isArray(examples) || examples.length === 0) {
        return '';
    }

    return examples
        .map(ex => `Input: ${ex.input}\nOutput: ${ex.output}`)
        .join('\n---\n');
}

/**
 * Format few-shot examples for a specific model output
 * @param {Array<{input: string, output: string}>} examples - Examples array
 * @param {string} modelId - Model identifier
 * @param {string} outputFormat - Output format (xml, json, markdown, yaml)
 * @returns {string} Model-formatted examples
 */
export function formatExamplesForModel(examples, modelId, outputFormat) {
    if (!Array.isArray(examples) || examples.length === 0) {
        return '';
    }

    if (outputFormat === 'xml') {
        let xml = '<examples>\n';
        examples.forEach((ex, i) => {
            xml += `  <example id="${i + 1}">\n`;
            xml += `    <input>${ex.input}</input>\n`;
            xml += `    <output>${ex.output}</output>\n`;
            xml += `  </example>\n`;
        });
        xml += '</examples>';
        return xml;
    }

    if (outputFormat === 'json') {
        return JSON.stringify({
            examples
        }, null, 2);
    }

    if (outputFormat === 'yaml') {
        let yaml = 'examples:\n';
        examples.forEach((ex, i) => {
            yaml += `  - id: ${i + 1}\n`;
            yaml += `    input: |\n      ${ex.input.replace(/\n/g, '\n      ')}\n`;
            yaml += `    output: |\n      ${ex.output.replace(/\n/g, '\n      ')}\n`;
        });
        return yaml;
    }

    // Default markdown format
    let md = '### Exemples\n\n';
    examples.forEach((ex, i) => {
        md += `**Exemple ${i + 1}:**\n`;
        md += `- **Input:** ${ex.input}\n`;
        md += `- **Output:** ${ex.output}\n\n`;
    });
    return md;
}

/**
 * Validate few-shot examples
 * @param {Array<{input: string, output: string}>} examples - Examples array
 * @returns {{valid: boolean, errors: string[], warnings: string[]}}
 */
export function validateFewShotExamples(examples) {
    const result = {
        valid: true,
        errors: [],
        warnings: []
    };

    if (!Array.isArray(examples)) {
        result.valid = false;
        result.errors.push('Les exemples doivent être un tableau.');
        return result;
    }

    if (examples.length === 0) {
        result.warnings.push('Aucun exemple défini. Ajoutez au moins 2-3 exemples pour un Few-shot efficace.');
        return result;
    }

    if (examples.length === 1) {
        result.warnings.push('Un seul exemple détecté. Le Few-shot fonctionne mieux avec 2-3 exemples minimum.');
    }

    examples.forEach((ex, i) => {
        if (!ex.input || !ex.input.trim()) {
            result.valid = false;
            result.errors.push(`Exemple ${i + 1}: Input manquant ou vide.`);
        }
        if (!ex.output || !ex.output.trim()) {
            result.valid = false;
            result.errors.push(`Exemple ${i + 1}: Output manquant ou vide.`);
        }
    });

    // Check for consistency in example format
    if (examples.length >= 2) {
        const firstInputLength = examples[0].input.length;
        const firstOutputLength = examples[0].output.length;
        let inconsistent = false;

        examples.slice(1).forEach(ex => {
            const inputRatio = ex.input.length / firstInputLength;
            const outputRatio = ex.output.length / firstOutputLength;
            if (inputRatio < 0.2 || inputRatio > 5 || outputRatio < 0.2 || outputRatio > 5) {
                inconsistent = true;
            }
        });

        if (inconsistent) {
            result.warnings.push('Les exemples ont des longueurs très différentes. Assurez-vous qu\'ils illustrent le même type de tâche.');
        }
    }

    return result;
}

/**
 * Create an empty example template
 * @returns {{input: string, output: string}}
 */
export function createEmptyExample() {
    return {
        input: '',
        output: ''
    };
}

/**
 * Generate placeholder content for the few_shot_examples section
 * @returns {string}
 */
export function getFewShotPlaceholder() {
    return `Input: Exemple d'entrée 1
Output: Exemple de sortie 1
---
Input: Exemple d'entrée 2
Output: Exemple de sortie 2
---
Input: Exemple d'entrée 3
Output: Exemple de sortie 3`;
}