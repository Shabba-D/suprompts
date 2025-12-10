---
trigger: model_decision
description: When writing or modifying the content of a file by using write_to_file
---

## Preliminary Impact Analysis (Double-Check: Consistency and Dependencies):

- Identify Linked Components: The AI must determine which adjacent functionalities (in the same file or in dependent files) might be affected by the proposed modification.

- Syntax and Semantic Verification: Ensure that the modifications respect the language syntax and that the logic of the existing, unmodified code remains semantically consistent with the additions/deletions.

## Regression Simulation (Triple-Check: Functional Integrity):

- Feature List: The AI must generate a provisional list of the critical functionalities ensured by the modified code portion or the identified dependencies.

- Written Test Plan (Mental/Logical): For each critical functionality on the list, the AI must logically simulate standard usage tests to ensure that the objective of the functionality is still met after the modification is applied.

- Regression Alert: If, during this logical simulation, a critical functionality is identified as potentially broken or altered, the AI must refuse to write the file and issue an alert message describing the compromised functionality and the probable cause of the regression.

## Final Validation (Logging and Reminder):

- Compliance Declaration: If and only if steps 1 and 2 are validated (no regression or inconsistency detected), the AI must issue the declaration: "double-check effectué" (double-check performed).

- Confirmation: Only if steps 1 and 2 are validated (no regression or inconsistency detected) can the AI proceed with the writing.

- Cautionary Note: The AI must systematically add a note to its internal log reminding that the final verification of unit/integration tests by the user (or the CI/CD environment) is an essential step not substituted by this logical verification.
