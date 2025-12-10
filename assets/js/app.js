        const paragraphCards = document.querySelectorAll('.paragraph-card');
        const cardsContainer = document.getElementById('cards-container');
        const promptOutput = document.getElementById('prompt-output');
        const languageSelector = document.getElementById('language');
        const copyPromptButton = document.getElementById('copy-prompt-btn');
        const copyFeedback = document.getElementById('copy-feedback');

        let cards = [];

        paragraphCards.forEach(card => {
                    card.addEventListener('click', () => {
                            const paragraphType = card.dataset.paragraph;

                            languageSelector.addEventListener('change', updatePrompt);

                            if (copyPromptButton) {
                                copyPromptButton.addEventListener('click', () => {
                                    if (!promptOutput) {
                                        return;
                                    }

                                    const textToCopy = promptOutput.textContent || '';

                                    if (!textToCopy.trim()) {
                                        showCopyFeedback('Nothing to copy', true);
                                        return;
                                    }

                                    if (navigator.clipboard && navigator.clipboard.writeText) {
                                        navigator.clipboard
                                            .writeText(textToCopy)
                                            .then(() => {
                                                showCopyFeedback('Prompt copied');
                                            })
                                            .catch(() => {
                                                showCopyFeedback('Unable to copy prompt', true);
                                            });
                                    } else {
                                        const helper = document.createElement('textarea');
                                        helper.value = textToCopy;
                                        helper.setAttribute('readonly', '');
                                        helper.style.position = 'absolute';
                                        helper.style.left = '-9999px';
                                        document.body.appendChild(helper);
                                        helper.select();

                                        try {
                                            document.execCommand('copy');
                                            showCopyFeedback('Prompt copied');
                                        } catch (e) {
                                            showCopyFeedback('Unable to copy prompt', true);
                                        }

                                        document.body.removeChild(helper);
                                    }
                                });
                            }

                            function addCard(type) {
                                // Prevent adding duplicate cards
                                if (cards.some(card => card.type === type)) {
                                    return;
                                }
                                const card = {
                                    id: Date.now(),
                                    type: type,
                                    content: ''
                                };
                                cards.push(card);
                                renderCards();
                                updatePrompt();
                            }

                            function removeCard(id) {
                                cards = cards.filter(card => card.id !== id);
                                renderCards();
                                updatePrompt();
                            }

                            function updateCardContent(id, content) {
                                const card = cards.find(card => card.id === id);
                                if (card) {
                                    card.content = content;
                                }
                                updatePrompt();
                            }

                            function renderCards() {
                                // Sort cards based on the order in the left panel
                                const order = Array.from(paragraphCards).map(card => card.dataset.paragraph);
                                cards.sort((a, b) => order.indexOf(a.type) - order.indexOf(b.type));

                                cardsContainer.innerHTML = '';
                                cards.forEach(card => {
                                        const cardElement = document.createElement('div');
                                        cardElement.className = 'card';
                                        cardElement.innerHTML = `
                const cardElement = document.createElement('div');
                cardElement.className = 'card';
                cardElement.innerHTML = ` <
                                            h3 > $ {
                                                card.type
                                            } < /h3> <
                                            textarea data - id = "${card.id}"
                                        placeholder = "Enter content for ${card.type}..." > $ {
                                                card.content
                                            } < /textarea> <
                                            div class = "card-footer" >
                                            <
                                            span class = "char-count" > $ {
                                                (card.content || '').length
                                            }
                                        characters < /span> <
                                            div >
                                            <
                                            button class = "clear-btn"
                                        data - id = "${card.id}" > Clear < /button> <
                                            button class = "remove-btn"
                                        data - id = "${card.id}" > Remove < /button> <
                                            /div> <
                                            /div>
                                        `;
                cardsContainer.appendChild(cardElement);

                const textarea = cardElement.querySelector('textarea');
                const charCount = cardElement.querySelector('.char-count');
                const clearButton = cardElement.querySelector('.clear-btn');
                const removeButton = cardElement.querySelector('.remove-btn');

                const updateCharCount = () => {
                    if (charCount) {
                        charCount.textContent = `
                                        $ {
                                            textarea.value.length
                                        }
                                        characters `;
                    }
                };

                updateCharCount();

                textarea.addEventListener('input', () => {
                    updateCardContent(card.id, textarea.value);
                    updateCharCount();
                });

                if (clearButton) {
                    clearButton.addEventListener('click', () => {
                        textarea.value = '';
                        updateCardContent(card.id, '');
                        updateCharCount();
                    });
                }

                if (removeButton) {
                    removeButton.addEventListener('click', () => {
                        removeCard(card.id);
                    });
                }
            });
        }

        function showCopyFeedback(message, isError) {
            if (!copyFeedback) {
                return;
            }

            copyFeedback.textContent = message;

            if (isError) {
                copyFeedback.style.color = '#e74c3c';
            } else {
                copyFeedback.style.color = '';
            }

            clearTimeout(showCopyFeedback._timeoutId);
            showCopyFeedback._timeoutId = setTimeout(() => {
                copyFeedback.textContent = '';
            }, 2000);
        }

        function updatePrompt() {
            if (!promptOutput || !languageSelector) {
                return;
            }

            const language = languageSelector.value;
            let promptText = '';

            // Ensure consistent order
            const order = Array.from(paragraphCards).map(card => card.dataset.paragraph);
            const sortedCards = [...cards].sort((a, b) => order.indexOf(a.type) - order.indexOf(b.type));

            if (language === 'markdown') {
                sortedCards.forEach(card => {
                    if (card.content) {
                        promptText += `
                                        # # $ {
                                            card.type
                                        }\
                                        n\ n$ {
                                            card.content
                                        }\
                                        n\ n `;
                    }
                });
            } else if (language === 'xml') {
                promptText += '<prompt>\n';
                sortedCards.forEach(card => {
                    if (card.content) {
                        promptText += ` < $ {
                                            card.type.toLowerCase()
                                        } > $ {
                                            card.content
                                        } < /${card.type.toLowerCase()}>\n`;
                                    }
                                });
                            promptText += '</prompt>';
                        }

                        promptOutput.textContent = promptText;
                    }