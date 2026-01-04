# Roadmap - Advanced Prompting & Model Support

## Vision

Transform Suprompts into a professional prompt engineering tool supporting advanced prompting techniques (Chain of Thought, Few-shot, ReAct) and model-specific optimizations (Claude, GPT, Gemini, Llama/Mistral).

---

## Known Issues / Bug Fixes

### Bug: Prompt type selector resets to "Musique" on page refresh ✅ FIXED

**Priority**: Medium | **Status**: Fixed

**Description**: After page refresh, the prompt type selector always defaults to "Musique" instead of restoring the last selected type from localStorage.

**Root cause**: In `initializeFromStorage()`, the restoration of `currentPromptType` was nested inside the condition checking for `cards` array. If cards were empty or missing, the prompt type was never restored.

**Fix applied**: Refactored `initializeFromStorage()` to restore model, promptType, and language independently from cards restoration.

---

## Phase 0: Foundation Refactoring (Prerequisites)

### 0.1. Split prompt_data.js ✅ COMPLETED

**Priority**: High | **Complexity**: Low | **Duration**: 2h

**Objective**: Improve maintainability by splitting the growing prompt_data.js into logical modules.

**Tasks**:

- [x] Create `assets/js/data/` directory
- [x] Split into modules:
  - `prompt_types.js` - PROMPT_TYPES definitions
  - `templates.js` - TEMPLATES definitions
  - `sections.js` - SECTIONS_DEFINITIONS
  - `models.js` - Future MODEL_CONFIGS (placeholder)
  - `techniques.js` - Future PROMPTING_TECHNIQUES (placeholder)
- [x] Update imports in main_core.js and other consumers
- [x] Test: Verify all existing functionality still works

**Success Criteria**:

- ✅ Application runs without errors
- ✅ All templates and types load correctly
- ✅ File sizes reduced (<300 lines per file)

---

## Phase 1: Model Support System

### 1.1. Create MODEL_CONFIGS structure ✅ COMPLETED

**Priority**: High | **Complexity**: Medium | **Duration**: 3h

**Objective**: Define configuration for each AI model with format preferences and constraints.

**Tasks**:

- [x] Create `assets/js/data/models.js` with MODEL_CONFIGS:
  - Claude (Anthropic): XML preference, thinking tags support
  - GPT (OpenAI): JSON friendly, system/user/assistant format
  - Gemini (Google): Structured context, multimodal
  - Llama/Mistral: Strict templates, instruction format
  - **DeepSeek (DeepSeek AI)**: Explicit reasoning structure, 64k tokens
- [x] Define model properties:
  - `id`, `displayName`, `vendor`
  - `preferredFormat` (xml, json, markdown)
  - `supportedTechniques` (array)
  - `maxTokensGuideline`
  - `specialInstructions` (model-specific tips)
  - `formatNotes` (format-specific guidance)

**Success Criteria**:

- ✅ MODEL_CONFIGS exported and importable
- ✅ Structure validated with 5 models (Claude, GPT, Gemini, Llama, DeepSeek)

### 1.2. Add model selector to UI ✅ COMPLETED

**Priority**: High | **Complexity**: Medium | **Duration**: 2h

**Tasks**:

- [x] Add model selector in HTML (before prompt-type-select)
- [x] Style selector to match existing design
- [x] Update CSS for new selector layout
- [x] Implement selector population in main_core.js
- [x] Add state management for `currentModel`
- [x] Save/restore selected model in localStorage

**Success Criteria**:

- ✅ Model selector visible and functional
- ✅ Selection persists across page reloads
- ✅ No UI regression

### 1.3. Implement model-aware output formatter ✅ COMPLETED

**Priority**: High | **Complexity**: Medium | **Duration**: 3h

**Tasks**:

- [x] Create `model_formatters.js` module
- [x] Implement formatters per model:
  - `formatForClaude()`: XML with semantic tags / Markdown with header
  - `formatForGPT()`: JSON/Markdown with clean structure
  - `formatForGemini()`: Hierarchical Task Description
  - `formatForLlama()`: Strict delimiters with uppercase sections
  - `formatForDeepSeek()`: Task Specification format
- [x] Update `updatePrompt()` to use model-specific formatter
- [x] Each model supports multiple output formats (MD/XML/JSON/YAML)

**Success Criteria**:

- ✅ Output format adapts based on selected model + output format
- ✅ Each formatter respects model preferences
- ✅ User can override with format selector

### 1.4. Add model-specific guidance ✅ COMPLETED

**Priority**: Medium | **Complexity**: Low | **Duration**: 2h

**Tasks**:

- [x] Create tooltip/info icon next to model selector
- [x] Display model characteristics on hover/click:
  - Preferred format
  - Supported techniques
  - Best practices
  - Format notes
  - Token limits
- [x] Add inline hints in prompt output area (format hint showing optimal/suggested format)

**Success Criteria**:

- ✅ Users can see model-specific recommendations via info modal
- ✅ Guidance is contextual and helpful
- ✅ Format hint updates dynamically based on model and format selection

---

## Phase 2: Advanced Sections & Few-shot Support

### 2.1. Add specialized sections ✅ COMPLETED

**Priority**: High | **Complexity**: Medium | **Duration**: 4h

**Tasks**:

- [x] Update `core_i18n.js` with new sections:
  - `reasoning_steps`: Chain of Thought structure
  - `few_shot_examples`: Formatted examples zone
  - `thinking_process`: Reasoning guide
  - `output_schema`: JSON/XML schema definition
  - `system_instructions`: Model-specific system prompts
- [x] Add new prompt types:
  - `advanced`: For CoT and Few-shot prompting
  - `code`: For development tasks
- [x] Add section descriptions and placeholders (in core_i18n.js)
- [x] UI rendering already supports new sections via existing architecture
- [x] Section visibility based on prompt type (visibleSections array)

**Success Criteria**:

- ✅ New sections appear in left panel when selecting "Avancé" or "Code" type
- ✅ Sections are properly labeled and described
- ✅ Conditional visibility works via prompt type selection

### 2.2. Build Few-shot examples editor ✅ COMPLETED

**Priority**: High | **Complexity**: High | **Duration**: 6h

**Tasks**:

- [x] Create `core_fewshot.js` module with:
  - `parseFewShotExamples()`: Parse Input/Output pairs from text
  - `formatFewShotExamples()`: Format examples back to text
  - `formatExamplesForModel()`: Model-specific formatting (XML/JSON/YAML/MD)
  - `validateFewShotExamples()`: Validation with warnings
- [x] Example format: `Input: ... Output: ...` separated by `---`
- [x] Examples stored in card data structure (few_shot_examples section)
- [ ] (Future) Structured UI with add/remove buttons

**Success Criteria**:

- ✅ Users can add examples in text format
- ✅ Examples format correctly per model
- ✅ Examples persist in storage

### 2.3. Enhanced quality analyzer ✅ COMPLETED

**Priority**: Medium | **Complexity**: Medium | **Duration**: 3h

**Tasks**:

- [x] Update `core_analysis.js` to check:
  - CoT: presence of reasoning_steps section
  - Few-shot: minimum 2-3 examples detection
  - System instructions presence
  - Output schema presence
- [x] Add technique-specific recommendations
- [x] Scoring accounts for advanced sections

**Success Criteria**:

- ✅ Analysis accounts for new sections
- ✅ Recommendations are technique-aware

---

## Phase 3: Prompting Techniques Templates

### 3.1. Create PROMPTING_TECHNIQUES structure ✅ COMPLETED

**Priority**: High | **Complexity**: Medium | **Duration**: 3h

**Tasks**:

- [x] Update `assets/js/data/techniques.js` with full definitions
- [x] Define 8 techniques:
  - `zero-shot`: Direct instruction
  - `few-shot`: Learning by examples
  - `chain-of-thought`: Step-by-step reasoning
  - `react`: Reasoning + Acting
  - `tree-of-thoughts`: Multiple reasoning paths
  - `self-consistency`: Multiple attempts + consolidation
  - `role-prompting`: Persona-based prompting
  - `structured-output`: Forced output format
- [x] Each technique includes:
  - `requiredSections`, `optionalSections`
  - `compatibleModels`
  - `description`, `useCases`
  - `template` (pre-filled content)

**Success Criteria**:

- ✅ PROMPTING_TECHNIQUES exported with 8 techniques
- ✅ Each technique well documented with French descriptions

### 3.2. Add technique selector to UI ✅ COMPLETED

**Priority**: High | **Complexity**: Medium | **Duration**: 3h

**Tasks**:

- [x] Add technique selector after prompt type selector in HTML
- [x] Add technique info button with modal
- [x] Implement technique info modal with:
  - Description
  - Required/optional sections
  - Compatible models
  - Use cases
- [x] Filter compatible techniques per model
- [x] Add "Apply template" button to load technique preset

**Success Criteria**:

- ✅ Technique selector functional
- ✅ Info modal shows technique details
- ✅ Only compatible techniques shown per model
- ✅ Template can be applied with pre-filled content

### 3.3. Create technique-specific templates ✅ COMPLETED

**Priority**: High | **Complexity**: High | **Duration**: 8h

**Tasks**:

- [x] Create template for each technique:
  - **Chain of Thought**:
    - Thinking section
    - Step-by-step breakdown
    - Final answer section
  - **Few-shot**:
    - Example format
    - Pattern recognition
    - New task application
  - **ReAct**:
    - Thought/Action/Observation loop
    - Tool usage framework
  - **Tree of Thoughts**:
    - Multiple branches structure
    - Evaluation criteria
    - Selection process
- [x] Add presets for each template (in `templates.js`)
- [x] Create 2 variants per technique (beginner/advanced)
- [x] Update template selector to show techniques (categorized groups)

**Success Criteria**:

- ✅ 8 technique templates available (4 techniques × 2 levels)
- ✅ Each template has clear structure
- ✅ Templates work with multiple models

### 3.4. Contextual guidance system ✅ COMPLETED

**Priority**: Medium | **Complexity**: Medium | **Duration**: 4h

**Tasks**:

- [x] Create `core_guidance.js` module
- [x] Implement contextual help:
  - Show technique explanation
  - Display section-specific tips
  - Provide model + technique best practices
- [x] Add best practices section to technique modal
- [x] Create modal with technique documentation

**Success Criteria**:

- ✅ Users understand each technique
- ✅ Guidance appears contextually
- ✅ Best practices shown per model+technique

---

## Phase 4: UI/UX Improvements

### 4.1. Complexity management ✅ COMPLETED

**Priority**: High | **Complexity**: Medium | **Duration**: 3h

**Tasks**:

- [x] Add "Mode" toggle: Simple / Advanced
  - Simple: Hide technique selector, use defaults
  - Advanced: Full controls visible
- [x] Save mode preference in localStorage
- [x] Update UI density based on mode
- [x] Add onboarding hint for first-time users (`showOnboardingHint()`)

**Success Criteria**:

- ✅ Beginners not overwhelmed
- ✅ Advanced users have full control
- ✅ Smooth mode switching

### 4.2. Visual hierarchy improvements ✅ COMPLETED

**Priority**: Medium | **Complexity**: Low | **Duration**: 2h

**Tasks**:

- [x] Reorganize top selector bar layout with `.selectors-group`
- [x] Add visual separators (`.selector-divider`)
- [x] Improve spacing and alignment
- [x] Add icons for each selector type (⚙️ 🤖 📝 🎯)

**Success Criteria**:

- ✅ Selectors clearly organized
- ✅ Visual flow intuitive
- ✅ No layout regression on mobile

### 4.3. Enhanced tooltips and help ✅ COMPLETED

**Priority**: Medium | **Complexity**: Low | **Duration**: 2h

**Tasks**:

- [x] Add help icons (?) next to each major element
- [x] Implement tooltip system with rich content (`.help-tooltip`)
- [x] CSS-based tooltips with smooth animations
- [ ] Add "Learn more" links to documentation (future)

**Success Criteria**:

- ✅ Every new concept has explanation
- ✅ Help is discoverable but not intrusive

---

## Phase 5: Testing & Documentation

### 5.1. Comprehensive testing ✅ COMPLETED

**Priority**: High | **Complexity**: Medium | **Duration**: 4h

**Tasks**:

- [x] Create test checklist (`TESTS_CHECKLIST.md`)
- [x] Document all model + technique combinations to test
- [x] Include localStorage compatibility tests
- [x] Include import/export tests
- [x] Include browser compatibility matrix
- [x] Include responsive/mobile tests

**Success Criteria**:

- ✅ Test plan documented
- ✅ All features covered in checklist

### 5.2. User documentation ✅ COMPLETED

**Priority**: Medium | **Complexity**: Low | **Duration**: 3h

**Tasks**:

- [x] Create user guide (`README.md`)
  - How to choose a model
  - When to use each technique
  - Best practices per model
- [x] Document all features
- [x] Add changelog/what's new

**Success Criteria**:

- ✅ Clear documentation available
- ✅ Examples cover common use cases

### 5.3. Migration & backward compatibility ✅ COMPLETED

**Priority**: High | **Complexity**: Medium | **Duration**: 2h

**Tasks**:

- [x] Implement storage schema migration (`migrateStorage()`)
- [x] Add fallback for old prompt format (model/technique defaults)
- [x] Add version indicator in storage (`CURRENT_STORAGE_VERSION = 2`)
- [x] Auto-migration on load

**Success Criteria**:

- ✅ Existing prompts load correctly
- ✅ No data loss during migration
- ✅ Graceful handling of old formats

---

## Phase 6: Persona System ✅ COMPLETED

### 6.1. Persona data structure ✅ COMPLETED

**Priority**: High | **Complexity**: Medium | **Duration**: 2h

**Tasks**:

- [x] Create `personas.js` with persona dimensions:
  - Style (formal, casual, technical, pedagogical, creative, concise)
  - Expertise (tech, business, science, creative_arts, education, health, legal, marketing)
  - Behavior (supportive, challenger, analytical, collaborative, directive, exploratory)
  - Experience level (junior, mid, senior, expert)
- [x] Define persona categories (development, business, creative, analysis, education, specialized)
- [x] Create `buildPersonaPrompt()` function for dynamic generation
- [x] Add search and filter functions

**Success Criteria**:

- ✅ 4 persona dimensions defined
- ✅ 6 persona categories
- ✅ Utility functions for search/filter

### 6.2. Persona library ✅ COMPLETED

**Priority**: High | **Complexity**: Medium | **Duration**: 3h

**Tasks**:

- [x] Create 12+ ready-to-use personas:
  - Development: Architecte, Reviewer, Debug Detective
  - Business: Consultant, Product Manager
  - Creative: UX Designer, Copywriter
  - Analysis: Devil's Advocate, Data Analyst
  - Education: Patient Tutor, Socratic Mentor
  - Specialized: Security Expert, Legal Advisor
- [x] Each persona with name, description, dimensions, and prompt
- [x] Add tags for searchability

**Success Criteria**:

- ✅ 12 personas available
- ✅ Each has complete prompt
- ✅ Searchable by name, description, tags

### 6.3. Persona builder ✅ COMPLETED

**Priority**: Medium | **Complexity**: Medium | **Duration**: 2h

**Tasks**:

- [x] Create builder modal with dimension selects
- [x] Live preview of generated persona
- [x] Custom context textarea for additional details
- [x] Apply button to inject into profil section

**Success Criteria**:

- ✅ All 4 dimensions selectable
- ✅ Real-time preview
- ✅ Custom context supported

### 6.4. UI integration ✅ COMPLETED

**Priority**: High | **Complexity**: Low | **Duration**: 1h

**Tasks**:

- [x] Add persona selector in left panel
- [x] Create library modal with categories and search
- [x] Create builder modal with form
- [x] Apply persona to profil card with toast feedback
- [x] Add CSS styles for all persona components

**Success Criteria**:

- ✅ Two buttons: Bibliothèque + Builder
- ✅ Modals open/close correctly
- ✅ Personas apply to profil section

---

## Risk Management

### Technical Risks

- **File size bloat**: Mitigated by module splitting (Phase 0)
- **Performance degradation**: Monitor with large prompt counts
- **localStorage limits**: Add data size warnings, cleanup utilities

### UX Risks

- **Overwhelming complexity**: Addressed by Simple/Advanced modes (Phase 4.1)
- **Learning curve**: Mitigated by contextual guidance (Phase 3.4)
- **Feature discoverability**: Solved with tooltips and onboarding

### Maintenance Risks

- **Code complexity**: Regular refactoring, maintain <400 lines per file
- **Testing coverage**: Manual testing checklist per phase
- **Documentation drift**: Update docs with each feature addition

---

## Success Metrics

### Quantitative

- [ ] Application loads in <2s with all features
- [ ] localStorage usage <5MB for typical use
- [ ] Zero console errors on fresh install
- [ ] Support 4+ models, 6+ techniques

### Qualitative

- [ ] Users can create advanced prompts in <5 minutes
- [ ] New users understand basic features without docs
- [ ] Advanced users find all controls they need
- [ ] No feature regression from current version

---

## Timeline Estimate

- **Phase 0**: 2 hours (1 session)
- **Phase 1**: 10 hours (2-3 sessions)
- **Phase 2**: 13 hours (3-4 sessions)
- **Phase 3**: 18 hours (4-5 sessions)
- **Phase 4**: 7 hours (2 sessions)
- **Phase 5**: 9 hours (2-3 sessions)

**Total: ~59 hours** (7-9 working days)

---

## Next Steps

1. Review and validate this roadmap
2. Start with Phase 0 (module split)
3. Implement phases sequentially
4. Test thoroughly after each phase
5. Iterate based on feedback
