# Product

<!-- impeccable:product-schema 1 -->

## Platform

web

## Stack

React + Vite (the user requested a React app).

## Users

The primary user is a Vietnamese learner preparing for a real-estate broker certification exam, studying independently in a web browser.

## Product Purpose

Provide a local, self-paced way to study all multiple-choice questions in the two supplied PDF question banks. Success means the learner can answer questions, understand the marked correct answer, revisit mistakes and starred questions, and retain progress between visits.

## Positioning

The study material comes from the learner's supplied exam question banks, including answers identified by their blue text in the PDFs. The app keeps learner progress in the browser without a backend.

## Operating Context

The learner studies from the "Cơ sở" and "Chuyên môn" question banks on desktop or mobile web, in short independent sessions. The supplied PDFs are located one directory above the React app.

## Capabilities and Constraints

- Show the source questions and answer choices, identify correct and incorrect selections, and show an explanation when available.
- Let the learner star questions and review incorrect or starred questions.
- Save study state locally in browser storage; no backend is required.
- Open directly to the next study question so the learner can begin immediately.
- Preserve the meaning and wording of source questions and answers. Some source entries may not provide every distractor or a written explanation; represent missing source material honestly rather than inventing it.
- The available sources are two PDF banks, one for "Cơ sở" and one for "Chuyên môn". No separate four-test set was present in the project files.

## Evidence on Hand

- `../261026 Ngân hàng Ôn Thi VL (Cơ Sở).pdf` — 19-page foundation question bank.
- `../261026 Ngân hàng Ôn Thi VL (Chuyên Môn) - 2.pdf` — 21-page specialist question bank.
- Correct options in the PDFs are shown in blue. Some pages include a short explanation; many entries only provide the selected answer.

## Product Principles

- Keep the question and its answer choices central while studying.
- Make progress, errors, and review items easy to find.
- Be transparent when the source does not include an explanation or full set of choices.
- Keep personal progress in the browser and make it easy to resume.
