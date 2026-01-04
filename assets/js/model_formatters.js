// Model-specific prompt formatters
// Each AI model has preferences for how prompts should be structured

import {
    PROMPT_SECTIONS
} from './core_i18n.js';

/**
 * Format prompt for Claude (Anthropic)
 * Prefers XML structure with semantic tags
 */
function formatForClaude(cards, outputFormat) {
    if (outputFormat === 'xml') {
        let xml = '<prompt>\n';
        cards.forEach(card => {
            if (card.content) {
                const tag = card.type.toLowerCase();
                xml += `  <${tag}>\n    ${card.content.replace(/\n/g, '\n    ')}\n  </${tag}>\n`;
            }
        });
        xml += '</prompt>';
        return xml;
    }

    // Markdown with main header and semantic sections
    let text = '# Prompt\n\n';
    cards.forEach(card => {
        if (card.content) {
            const label = (PROMPT_SECTIONS[card.type] && PROMPT_SECTIONS[card.type].label) || card.type;
            text += `## ${label}\n\n${card.content}\n\n`;
        }
    });
    return text;
}

/**
 * Format prompt for GPT (OpenAI)
 * Prefers clean markdown with clear section hierarchy
 */
function formatForGPT(cards, outputFormat) {
    if (outputFormat === 'xml') {
        let xml = '<prompt>\n';
        cards.forEach(card => {
            if (card.content) {
                const tag = card.type.toLowerCase();
                xml += `  <${tag}>\n    ${card.content.replace(/\n/g, '\n    ')}\n  </${tag}>\n`;
            }
        });
        xml += '</prompt>';
        return xml;
    }

    if (outputFormat === 'json') {
        const obj = {};
        cards.forEach(card => {
            if (card.content && card.content.trim()) {
                obj[card.type.toLowerCase()] = card.content;
            }
        });
        return JSON.stringify(obj, null, 2);
    }

    // Clean markdown with emphasis on structure
    let text = '# Prompt\n\n';
    cards.forEach(card => {
        if (card.content) {
            const label = (PROMPT_SECTIONS[card.type] && PROMPT_SECTIONS[card.type].label) || card.type;
            text += `## ${label}\n\n${card.content}\n\n`;
        }
    });
    return text;
}

/**
 * Format prompt for Gemini (Google)
 * Prefers hierarchical markdown with clear sections
 */
function formatForGemini(cards, outputFormat) {
    if (outputFormat === 'xml') {
        let xml = '<task>\n';
        cards.forEach(card => {
            if (card.content) {
                const tag = card.type.toLowerCase();
                xml += `  <${tag}>\n    ${card.content.replace(/\n/g, '\n    ')}\n  </${tag}>\n`;
            }
        });
        xml += '</task>';
        return xml;
    }

    if (outputFormat === 'json') {
        const obj = {
            sections: {}
        };
        cards.forEach(card => {
            if (card.content && card.content.trim()) {
                obj.sections[card.type.toLowerCase()] = card.content;
            }
        });
        return JSON.stringify(obj, null, 2);
    }

    // Hierarchical markdown
    let text = '# Task Description\n\n';
    cards.forEach(card => {
        if (card.content) {
            const label = (PROMPT_SECTIONS[card.type] && PROMPT_SECTIONS[card.type].label) || card.type;
            text += `## ${label}\n\n${card.content}\n\n`;
        }
    });
    return text;
}

/**
 * Format prompt for Llama/Mistral
 * Prefers strict delimiters and explicit structure
 */
function formatForLlama(cards, outputFormat) {
    if (outputFormat === 'xml') {
        let xml = '<instruction>\n';
        cards.forEach(card => {
            if (card.content) {
                const tag = card.type.toLowerCase();
                xml += `  <${tag}>\n    ${card.content.replace(/\n/g, '\n    ')}\n  </${tag}>\n`;
            }
        });
        xml += '</instruction>';
        return xml;
    }

    if (outputFormat === 'json') {
        const obj = {};
        cards.forEach(card => {
            if (card.content && card.content.trim()) {
                obj[card.type.toLowerCase()] = card.content;
            }
        });
        return JSON.stringify(obj, null, 2);
    }

    // Strict delimiters between sections
    let text = '';
    cards.forEach(card => {
        if (card.content) {
            const label = (PROMPT_SECTIONS[card.type] && PROMPT_SECTIONS[card.type].label) || card.type;
            text += `### ${label.toUpperCase()}\n`;
            text += `---\n`;
            text += `${card.content}\n`;
            text += `---\n\n`;
        }
    });
    return text;
}

/**
 * Format prompt for DeepSeek
 * Prefers explicit numbered structure with clear reasoning steps
 */
function formatForDeepSeek(cards, outputFormat) {
    if (outputFormat === 'xml') {
        let xml = '<task_specification>\n';
        cards.forEach(card => {
            if (card.content) {
                const tag = card.type.toLowerCase();
                xml += `  <${tag}>\n    ${card.content.replace(/\n/g, '\n    ')}\n  </${tag}>\n`;
            }
        });
        xml += '</task_specification>';
        return xml;
    }

    if (outputFormat === 'json') {
        const obj = {
            task: {}
        };
        cards.forEach(card => {
            if (card.content && card.content.trim()) {
                obj.task[card.type.toLowerCase()] = card.content;
            }
        });
        return JSON.stringify(obj, null, 2);
    }

    // Clear structured markdown with explicit sections
    let text = '# Task Specification\n\n';
    cards.forEach(card => {
        if (card.content) {
            const label = (PROMPT_SECTIONS[card.type] && PROMPT_SECTIONS[card.type].label) || card.type;
            text += `## ${label}\n\n${card.content}\n\n`;
        }
    });
    return text;
}

/**
 * Main formatter function that routes to model-specific formatter
 * @param {Array} cards - Cards to format
 * @param {string} modelId - Model identifier (claude, gpt, gemini, llama, deepseek)
 * @param {string} outputFormat - Output format (markdown, xml, json, yaml)
 * @returns {string} Formatted prompt text
 */
export function formatPromptForModel(cards, modelId, outputFormat) {
    // Handle YAML separately as it's format-specific, not model-specific
    if (outputFormat === 'yaml') {
        const lines = [];
        cards.forEach(card => {
            if (card.content && card.content.trim()) {
                const key = card.type.toLowerCase();
                lines.push(key + ': |');
                card.content.split('\n').forEach(line => {
                    lines.push('  ' + line);
                });
            }
        });
        return lines.join('\n');
    }

    switch (modelId) {
        case 'claude':
            return formatForClaude(cards, outputFormat);
        case 'gpt':
            return formatForGPT(cards, outputFormat);
        case 'gemini':
            return formatForGemini(cards, outputFormat);
        case 'llama':
            return formatForLlama(cards, outputFormat);
        case 'deepseek':
            return formatForDeepSeek(cards, outputFormat);
        default:
            // Fallback to GPT style
            return formatForGPT(cards, outputFormat);
    }
}