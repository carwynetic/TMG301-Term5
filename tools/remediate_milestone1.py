#!/usr/bin/env python3
"""
TMG301 Milestone 1: Content & Data Remediation Script
Applies all corrections to data/questions.json and data/knowledge.json
"""

import os
import json
import re

ROOT = os.path.abspath(os.path.join(os.path.dirname(__file__), '..'))
QUESTIONS_PATH = os.path.join(ROOT, 'data', 'questions.json')
KNOWLEDGE_PATH = os.path.join(ROOT, 'data', 'knowledge.json')

def remediate_questions():
    with open(QUESTIONS_PATH, 'r', encoding='utf-8') as f:
        questions = json.load(f)

    corrections = []

    # Map of question id to updater function
    for q in questions:
        qid = q['id']

        # Task 1: Fix q_ch01_01 Option 0 lone $
        if qid == 'q_ch01_01':
            orig = json.dumps(q, ensure_ascii=False)
            q['options'][0] = '<code>$</code>'
            corrections.append({
                'id': qid,
                'chapter': q['chapter'],
                'field': 'options[0]',
                'before': '$',
                'after': '<code>$</code>',
                'reason': 'Wrap lone regex end-of-line anchor in <code> tag to prevent KaTeX delimiter hijacking'
            })

        # Task 2: Math conversions
        # q_ch02_33
        elif qid == 'q_ch02_33':
            orig_q = q['question']
            orig_opts = list(q['options'])
            orig_exp = q['explanation']
            q['question'] = "In Good-Turing smoothing, what is the formula for the adjusted count $r^*$ for an N-gram with raw count $r$?"
            q['options'] = [
                "$r^* = (r + 1) \\frac{N_{r+1}}{N_r}$",
                "$r^* = r - 0.75$",
                "$r^* = \\frac{r}{|V|}$",
                "$r^* = r + 1$"
            ]
            q['explanation'] = "Good-Turing replaces count $r$ with $r^* = (r + 1) \\frac{N_{r+1}}{N_r}$."
            corrections.append({
                'id': qid,
                'chapter': q['chapter'],
                'field': 'question, options, explanation',
                'before': f"Q: {orig_q} | Opt0: {orig_opts[0]} | Exp: {orig_exp}",
                'after': f"Q: {q['question']} | Opt0: {q['options'][0]} | Exp: {q['explanation']}",
                'reason': 'Standardize Good-Turing adjusted count formula and variables in KaTeX ($r^*$, $N_{r+1}/N_r$)'
            })

        # q_ch04_02
        elif qid == 'q_ch04_02':
            orig_opts = list(q['options'])
            orig_exp = q['explanation']
            q['options'] = [
                "$\\sigma(z) = \\frac{e^z}{1 - e^z}$",
                "$\\sigma(z) = \\frac{1}{1 + e^{-z}}$",
                "$\\sigma(z) = \\frac{e^z - e^{-z}}{2}$",
                "$\\sigma(z) = \\max(0, z)$"
            ]
            q['explanation'] = "The sigmoid function $\\sigma(z) = \\frac{1}{1 + e^{-z}}$ maps any real-valued number into the probability interval $(0, 1)$."
            corrections.append({
                'id': qid,
                'chapter': q['chapter'],
                'field': 'options, explanation',
                'before': f"Opt1: {orig_opts[1]} | Exp: {orig_exp}",
                'after': f"Opt1: {q['options'][1]} | Exp: {q['explanation']}",
                'reason': 'Standardize sigmoid activation function formula from ASCII sigma(z) into KaTeX $\\sigma(z)$'
            })

        # q_ch04_03
        elif qid == 'q_ch04_03':
            orig_exp = q['explanation']
            q['explanation'] = "$\\sigma(0) = \\frac{1}{1 + e^0} = \\frac{1}{1 + 1} = 0.5$."
            corrections.append({
                'id': qid,
                'chapter': q['chapter'],
                'field': 'explanation',
                'before': orig_exp,
                'after': q['explanation'],
                'reason': 'Standardize sigmoid evaluation at z=0 into KaTeX'
            })

        # q_ch04_05
        elif qid == 'q_ch04_05':
            orig_q = q['question']
            orig_opts = list(q['options'])
            orig_exp = q['explanation']
            q['question'] = "What is the mathematical derivative of the sigmoid function $\\sigma(z)$ with respect to $z$?"
            q['options'] = [
                "$\\sigma'(z) = \\sigma(z)^2$",
                "$\\sigma'(z) = 1 - \\sigma(z)$",
                "$\\sigma'(z) = e^{-z}$",
                "$\\sigma'(z) = \\sigma(z)(1 - \\sigma(z))$"
            ]
            q['explanation'] = "A key property of sigmoid is its elegant derivative: $\\frac{d}{dz} \\sigma(z) = \\sigma(z)(1 - \\sigma(z))$."
            corrections.append({
                'id': qid,
                'chapter': q['chapter'],
                'field': 'question, options, explanation',
                'before': f"Q: {orig_q} | Opt3: {orig_opts[3]} | Exp: {orig_exp}",
                'after': f"Q: {q['question']} | Opt3: {q['options'][3]} | Exp: {q['explanation']}",
                'reason': 'Standardize sigmoid derivative formula into clean KaTeX $\\sigma\'(z)$'
            })

        # q_ch04_21
        elif qid == 'q_ch04_21':
            orig_opts = list(q['options'])
            orig_exp = q['explanation']
            q['options'] = [
                "$\\frac{\\lambda}{2} \\sum w_j^2$",
                "$\\frac{\\lambda}{\\sum w_j}$",
                "$\\lambda \\sum |w_j|$",
                "$\\lambda \\max(w_j)$"
            ]
            q['explanation'] = "L2 regularization penalizes the sum of squared weights: $\\frac{\\lambda}{2} \\|w\\|_2^2$."
            corrections.append({
                'id': qid,
                'chapter': q['chapter'],
                'field': 'options, explanation',
                'before': f"Opt0: {orig_opts[0]} | Exp: {orig_exp}",
                'after': f"Opt0: {q['options'][0]} | Exp: {q['explanation']}",
                'reason': 'Standardize L2 Ridge penalty formula into KaTeX'
            })

        # q_ch04_22
        elif qid == 'q_ch04_22':
            orig_opts = list(q['options'])
            orig_exp = q['explanation']
            q['options'] = [
                "$\\lambda \\log(w_j)$",
                "$\\lambda \\sum |w_j|$",
                "$\\frac{\\lambda}{2} \\sum w_j^2$",
                "$\\lambda \\sum w_j^3$"
            ]
            q['explanation'] = "L1 regularization penalizes the sum of absolute weight values: $\\lambda \\|w\\|_1$."
            corrections.append({
                'id': qid,
                'chapter': q['chapter'],
                'field': 'options, explanation',
                'before': f"Opt1: {orig_opts[1]} | Exp: {orig_exp}",
                'after': f"Opt1: {q['options'][1]} | Exp: {q['explanation']}",
                'reason': 'Standardize L1 Lasso penalty formula into KaTeX'
            })

        # q_ch04_30
        elif qid == 'q_ch04_30':
            orig_q = q['question']
            orig_opts = list(q['options'])
            orig_exp = q['explanation']
            q['question'] = "What is the Softmax formula for class $c$ among $K$ classes?"
            q['options'] = [
                "$\\text{softmax}(z)_c = \\frac{z_c}{\\sum z_j}$",
                "$\\text{softmax}(z)_c = \\frac{1}{1 + e^{-z_c}}$",
                "$\\text{softmax}(z)_c = \\frac{e^{z_c}}{\\sum_{j=1}^K e^{z_j}}$",
                "$\\text{softmax}(z)_c = e^{z_c} \\cdot K$"
            ]
            q['explanation'] = "Softmax exponentiates logits $z_c$ and normalizes by the sum of exponentiated logits across all classes: $\\text{softmax}(z)_c = \\frac{e^{z_c}}{\\sum_{j=1}^K e^{z_j}}$."
            corrections.append({
                'id': qid,
                'chapter': q['chapter'],
                'field': 'question, options, explanation',
                'before': f"Q: {orig_q} | Opt2: {orig_opts[2]} | Exp: {orig_exp}",
                'after': f"Q: {q['question']} | Opt2: {q['options'][2]} | Exp: {q['explanation']}",
                'reason': 'Convert raw pseudo-LaTeX SUM_{j=1}^K and e^(z_c) into standardized KaTeX fraction'
            })

        # q_ch04_32
        elif qid == 'q_ch04_32':
            orig_opts = list(q['options'])
            orig_exp = q['explanation']
            q['options'] = [
                "Binary Hinge Loss",
                "Categorical Cross-Entropy Loss: $-\\sum_{c=1}^K y_c \\log(\\hat{y}_c)$",
                "K-Means Inertia",
                "Mean Squared Error"
            ]
            q['explanation'] = "Categorical Cross-Entropy measures the divergence between the true one-hot vector $y$ and predicted probabilities $\\hat{y}$: $L = -\\sum_{c=1}^K y_c \\log(\\hat{y}_c)$."
            corrections.append({
                'id': qid,
                'chapter': q['chapter'],
                'field': 'options[1], explanation',
                'before': f"Opt1: {orig_opts[1]} | Exp: {orig_exp}",
                'after': f"Opt1: {q['options'][1]} | Exp: {q['explanation']}",
                'reason': 'Convert raw pseudo-LaTeX - SUM_{c=1}^K y_c * log(y_hat_c) into KaTeX $-\\sum_{c=1}^K y_c \\log(\\hat{y}_c)$'
            })

        # q_ch04_50
        elif qid == 'q_ch04_50':
            orig_opts = list(q['options'])
            q['options'][1] = "When the change in loss $|L_t - L_{t-1}|$ or gradient norm $\\|dL/dw\\|$ falls below a tolerance threshold $\\epsilon$ (e.g. $10^{-4}$)"
            corrections.append({
                'id': qid,
                'chapter': q['chapter'],
                'field': 'options[1]',
                'before': orig_opts[1],
                'after': q['options'][1],
                'reason': 'Convert raw pseudo-LaTeX |L_{t} - L_{t-1}| and ||dL/dw|| into KaTeX $|L_t - L_{t-1}|$ and $\\|dL/dw\\|$'
            })

        # q_ch05_10
        elif qid == 'q_ch05_10':
            orig_opts = list(q['options'])
            orig_exp = q['explanation']
            q['options'] = [
                "$\\cos(u, v) = \\frac{u \\cdot v}{2}$",
                "$\\cos(u, v) = \\frac{u \\cdot v}{\\|u\\| \\cdot \\|v\\|}$",
                "$\\cos(u, v) = \\|u\\| - \\|v\\|$",
                "$\\cos(u, v) = u \\cdot v$"
            ]
            q['explanation'] = "Cosine similarity computes the dot product of two vectors normalized by the product of their L2 Euclidean norms: $\\cos(u, v) = \\frac{u \\cdot v}{\\|u\\| \\|v\\|}$."
            corrections.append({
                'id': qid,
                'chapter': q['chapter'],
                'field': 'options, explanation',
                'before': f"Opt1: {orig_opts[1]} | Exp: {orig_exp}",
                'after': f"Opt1: {q['options'][1]} | Exp: {q['explanation']}",
                'reason': 'Standardize Cosine Similarity formula from ASCII into KaTeX $\\cos(u, v)$'
            })

        # q_ch05_18
        elif qid == 'q_ch05_18':
            orig_q = q['question']
            orig_opts = list(q['options'])
            orig_exp = q['explanation']
            q['question'] = "Why is standard Softmax computationally prohibitive when training Word2Vec on large vocabularies ($|V| = 1{,}000{,}000$)?"
            q['options'][0] = "Computing the denominator requires summing over all $|V|$ words in the vocabulary for every single training word, taking $O(|V|)$ time"
            q['explanation'] = "The normalizer $\\sum_{w \\in V} \\exp(u_w \\cdot v_c)$ requires computing dot products over the entire vocabulary at every step, causing severe computational bottlenecks."
            corrections.append({
                'id': qid,
                'chapter': q['chapter'],
                'field': 'question, options[0], explanation',
                'before': f"Q: {orig_q} | Opt0: {orig_opts[0]} | Exp: {orig_exp}",
                'after': f"Q: {q['question']} | Opt0: {q['options'][0]} | Exp: {q['explanation']}",
                'reason': 'Convert raw pseudo-LaTeX SUM_{w in V} exp(u_w . v_c) and O(|V|) into KaTeX'
            })

        # q_ch05_25
        elif qid == 'q_ch05_25':
            orig_exp = q['explanation']
            q['explanation'] = "GloVe minimizes $J = \\sum f(X_{ij}) (w_i^T \\tilde{w}_j + b_i + \\tilde{b}_j - \\log X_{ij})^2$ with a weighting function $f(X_{ij})$."
            corrections.append({
                'id': qid,
                'chapter': q['chapter'],
                'field': 'explanation',
                'before': orig_exp,
                'after': q['explanation'],
                'reason': 'Standardize GloVe loss function formula into KaTeX'
            })

        # q_ch05_31
        elif qid == 'q_ch05_31':
            orig_q = q['question']
            orig_opts = list(q['options'])
            orig_exp = q['explanation']
            q['question'] = "What is the Euclidean Distance between two vectors $u = [1, 2]$ and $v = [4, 6]$?"
            q['options'][1] = "$\\sqrt{(4-1)^2 + (6-2)^2} = \\sqrt{9 + 16} = \\sqrt{25} = 5.0$"
            q['explanation'] = "Euclidean distance $\\|u - v\\|_2 = \\sqrt{3^2 + 4^2} = \\sqrt{25} = 5.0$."
            corrections.append({
                'id': qid,
                'chapter': q['chapter'],
                'field': 'question, options[1], explanation',
                'before': f"Q: {orig_q} | Opt1: {orig_opts[1]} | Exp: {orig_exp}",
                'after': f"Q: {q['question']} | Opt1: {q['options'][1]} | Exp: {q['explanation']}",
                'reason': 'Standardize ASCII sqrt((4-1)^2...) and ||u-v||_2 into KaTeX'
            })

        # q_ch05_33
        elif qid == 'q_ch05_33':
            orig_exp = q['explanation']
            q['explanation'] = "Orthogonal vectors have dot product 0, so $\\cos(u, v) = \\frac{0}{\\|u\\| \\cdot \\|v\\|} = 0.0$."
            corrections.append({
                'id': qid,
                'chapter': q['chapter'],
                'field': 'explanation',
                'before': orig_exp,
                'after': q['explanation'],
                'reason': 'Standardize orthogonal vector cosine similarity calculation in KaTeX'
            })

        # q_ch05_43
        elif qid == 'q_ch05_43':
            orig_opts = list(q['options'])
            orig_exp = q['explanation']
            q['options'][3] = "They are Subsampled during training with a probability formula based on frequency $P(w)$ to accelerate learning and improve vector quality"
            q['explanation'] = "Mikolov et al. applied subsampling to discard frequent words with probability $P(w) = 1 - \\sqrt{\\frac{t}{f(w)}}$, speeding up training."
            corrections.append({
                'id': qid,
                'chapter': q['chapter'],
                'field': 'options[3], explanation',
                'before': f"Opt3: {orig_opts[3]} | Exp: {orig_exp}",
                'after': f"Opt3: {q['options'][3]} | Exp: {q['explanation']}",
                'reason': 'Convert ASCII P(w) = 1 - sqrt(t / f(w)) into KaTeX'
            })

        # q_ch05_47
        elif qid == 'q_ch05_47':
            orig_opts = list(q['options'])
            orig_exp = q['explanation']
            q['options'][2] = "5.0 ($\\sqrt{3^2 + 4^2} = \\sqrt{25} = 5.0$)"
            q['explanation'] = "$\\|v\\|_2 = \\sqrt{9 + 16} = 5.0$."
            corrections.append({
                'id': qid,
                'chapter': q['chapter'],
                'field': 'options[2], explanation',
                'before': f"Opt2: {orig_opts[2]} | Exp: {orig_exp}",
                'after': f"Opt2: {q['options'][2]} | Exp: {q['explanation']}",
                'reason': 'Convert ASCII sqrt(3^2 + 4^2) and ||v||_2 into KaTeX'
            })

        # q_ch05_48
        elif qid == 'q_ch05_48':
            orig_opts = list(q['options'])
            orig_exp = q['explanation']
            q['options'][0] = "$[3/5, 4/5] = [0.6, 0.8]$"
            q['explanation'] = "Dividing each component by norm $5.0$ gives $[0.6, 0.8]$. Its norm is $\\sqrt{0.36 + 0.64} = 1.0$."
            corrections.append({
                'id': qid,
                'chapter': q['chapter'],
                'field': 'options[0], explanation',
                'before': f"Opt0: {orig_opts[0]} | Exp: {orig_exp}",
                'after': f"Opt0: {q['options'][0]} | Exp: {q['explanation']}",
                'reason': 'Convert ASCII unit vector and sqrt(0.36 + 0.64) into KaTeX'
            })

        # q_ch06_03
        elif qid == 'q_ch06_03':
            orig_opts = list(q['options'])
            orig_exp = q['explanation']
            q['options'] = [
                "$\\text{SSE} = \\frac{\\sum \\mu_k}{K}$",
                "$\\text{SSE} = \\sum_{k=1}^K K^2$",
                "$\\text{SSE} = \\sum_{k=1}^K \\sum_{x \\in C_k} \\|x - \\mu_k\\|^2$",
                "$\\text{SSE} = \\max(x - \\mu_k)$"
            ]
            q['explanation'] = "Inertia/SSE sums the squared Euclidean distances from every data point $x$ to its assigned cluster centroid $\\mu_k$: $\\text{SSE} = \\sum_{k=1}^K \\sum_{x \\in C_k} \\|x - \\mu_k\\|^2$."
            corrections.append({
                'id': qid,
                'chapter': q['chapter'],
                'field': 'options, explanation',
                'before': f"Opt2: {orig_opts[2]} | Exp: {orig_exp}",
                'after': f"Opt2: {q['options'][2]} | Exp: {q['explanation']}",
                'reason': 'Convert raw pseudo-LaTeX SUM_{k=1}^K SUM_{x in C_k} ||x - mu_k||^2 into KaTeX'
            })

        # q_ch06_18
        elif qid == 'q_ch06_18':
            orig_exp = q['explanation']
            q['explanation'] = "Single linkage: $D(A, B) = \\min_{x \\in A, y \\in B} \\text{dist}(x, y)$."
            corrections.append({
                'id': qid,
                'chapter': q['chapter'],
                'field': 'explanation',
                'before': orig_exp,
                'after': q['explanation'],
                'reason': 'Convert raw pseudo-LaTeX min_{x in A, y in B} dist(x, y) into KaTeX'
            })

        # q_ch06_20
        elif qid == 'q_ch06_20':
            orig_exp = q['explanation']
            q['explanation'] = "Complete linkage: $D(A, B) = \\max_{x \\in A, y \\in B} \\text{dist}(x, y)$."
            corrections.append({
                'id': qid,
                'chapter': q['chapter'],
                'field': 'explanation',
                'before': orig_exp,
                'after': q['explanation'],
                'reason': 'Convert raw pseudo-LaTeX max_{x in A, y in B} dist(x, y) into KaTeX'
            })

        # q_ch06_22
        elif qid == 'q_ch06_22':
            orig_exp = q['explanation']
            q['explanation'] = "Average linkage: $D(A, B) = \\frac{1}{|A| \\cdot |B|} \\sum_{x \\in A} \\sum_{y \\in B} \\text{dist}(x, y)$."
            corrections.append({
                'id': qid,
                'chapter': q['chapter'],
                'field': 'explanation',
                'before': orig_exp,
                'after': q['explanation'],
                'reason': 'Convert raw pseudo-LaTeX SUM_{x in A} SUM_{y in B} into KaTeX'
            })

        # q_ch07_02
        elif qid == 'q_ch07_02':
            orig_opts = list(q['options'])
            orig_exp = q['explanation']
            q['options'][1] = "Sequential processing: RNNs must compute hidden state $h_t$ step-by-step from $h_{t-1}$, preventing parallel computation across the sequence on GPUs"
            q['explanation'] = "RNNs are fundamentally sequential ($O(T)$ time steps), creating a severe training bottleneck on modern parallel hardware."
            corrections.append({
                'id': qid,
                'chapter': q['chapter'],
                'field': 'options[1], explanation',
                'before': f"Opt1: {orig_opts[1]} | Exp: {orig_exp}",
                'after': f"Opt1: {q['options'][1]} | Exp: {q['explanation']}",
                'reason': 'Convert raw pseudo-LaTeX h_t and h_{t-1} into KaTeX $h_t$ and $h_{t-1}$'
            })

        # q_ch07_09
        elif qid == 'q_ch07_09':
            orig_opts = list(q['options'])
            orig_exp = q['explanation']
            q['options'] = [
                "$\\text{Attention}(Q, K, V) = \\frac{Q K}{V}$",
                "$\\text{Attention}(Q, K, V) = \\text{softmax}\\left(\\frac{Q K^T}{\\sqrt{d_k}}\\right) V$",
                "$\\text{Attention}(Q, K, V) = \\text{softmax}(Q + K) + V$",
                "$\\text{Attention}(Q, K, V) = Q K^T V$"
            ]
            q['explanation'] = "Scaled dot-product attention computes softmax of normalized dot products $\\left(\\frac{Q K^T}{\\sqrt{d_k}}\\right)$ multiplied by $V$: $\\text{Attention}(Q, K, V) = \\text{softmax}\\left(\\frac{Q K^T}{\\sqrt{d_k}}\\right) V$."
            corrections.append({
                'id': qid,
                'chapter': q['chapter'],
                'field': 'options, explanation',
                'before': f"Opt1: {orig_opts[1]} | Exp: {orig_exp}",
                'after': f"Opt1: {q['options'][1]} | Exp: {q['explanation']}",
                'reason': 'Standardize Scaled Dot-Product Attention ASCII formula into KaTeX'
            })

        # q_ch07_10
        elif qid == 'q_ch07_10':
            orig_q = q['question']
            orig_opts = list(q['options'])
            orig_exp = q['explanation']
            q['question'] = "Why is the dot product $Q K^T$ divided by the scaling factor $\\sqrt{d_k}$?"
            q['options'][0] = "To prevent the dot products from growing excessively large for high dimensions $d_k$, which pushes the Softmax into regions with vanishingly small gradients"
            q['explanation'] = "For large $d_k$, dot products grow large in magnitude, causing softmax to yield extremely peaked distributions with near-zero gradients."
            corrections.append({
                'id': qid,
                'chapter': q['chapter'],
                'field': 'question, options[0], explanation',
                'before': f"Q: {orig_q} | Opt0: {orig_opts[0]} | Exp: {orig_exp}",
                'after': f"Q: {q['question']} | Opt0: {q['options'][0]} | Exp: {q['explanation']}",
                'reason': 'Convert ASCII Q * K^T, sqrt(d_k), and d_k into KaTeX'
            })

        # q_ch07_11
        elif qid == 'q_ch07_11':
            orig_q = q['question']
            orig_exp = q['explanation']
            q['question'] = "If $d_k = 64$, what is the scaling factor $\\sqrt{d_k}$?"
            q['explanation'] = "$\\sqrt{64} = 8$. Dot products are divided by $8$ before applying softmax."
            corrections.append({
                'id': qid,
                'chapter': q['chapter'],
                'field': 'question, explanation',
                'before': f"Q: {orig_q} | Exp: {orig_exp}",
                'after': f"Q: {q['question']} | Exp: {q['explanation']}",
                'reason': 'Convert ASCII d_k and sqrt(d_k) into KaTeX'
            })

        # q_ch07_13
        elif qid == 'q_ch07_13':
            orig_q = q['question']
            orig_exp = q['explanation']
            q['question'] = "What does each row in the normalized attention matrix $\\text{softmax}\\left(\\frac{Q K^T}{\\sqrt{d_k}}\\right)$ represent?"
            q['explanation'] = "Softmax is applied row-wise, ensuring that attention weights assigned by token $i$ to all tokens $j$ sum to $1.0$."
            corrections.append({
                'id': qid,
                'chapter': q['chapter'],
                'field': 'question, explanation',
                'before': f"Q: {orig_q} | Exp: {orig_exp}",
                'after': f"Q: {q['question']} | Exp: {q['explanation']}",
                'reason': 'Convert ASCII softmax(Q * K^T / sqrt(d_k)) into KaTeX'
            })

        # q_ch07_34
        elif qid == 'q_ch07_34':
            orig_opts = list(q['options'])
            orig_exp = q['explanation']
            q['options'][0] = "It generates text token-by-token, conditioning each new token on the sequence of previously generated tokens: $P(w_t \\mid w_{<t})$"
            q['explanation'] = "Autoregressive models consume their own past outputs as inputs for generating subsequent steps: $P(w_t \\mid w_{<t})$."
            corrections.append({
                'id': qid,
                'chapter': q['chapter'],
                'field': 'options[0], explanation',
                'before': f"Opt0: {orig_opts[0]} | Exp: {orig_exp}",
                'after': f"Opt0: {q['options'][0]} | Exp: {q['explanation']}",
                'reason': 'Convert raw pseudo-LaTeX P(w_t | w_{<t}) into KaTeX $P(w_t \\mid w_{<t})$'
            })

        # q_ch08_27
        elif qid == 'q_ch08_27':
            orig_opts = list(q['options'])
            orig_exp = q['explanation']
            q['options'][3] = "It freezes the pre-trained model weights $W_0$ and injects trainable rank-decomposition matrices $\\Delta W = B \\cdot A$, where rank $r \\ll d$"
            q['explanation'] = "LoRA decomposes weight updates into two low-rank matrices $\\Delta W = B \\cdot A$ ($r \\ll d$), reducing trainable parameters by 10,000x."
            corrections.append({
                'id': qid,
                'chapter': q['chapter'],
                'field': 'options[3], explanation',
                'before': f"Opt3: {orig_opts[3]} | Exp: {orig_exp}",
                'after': f"Opt3: {q['options'][3]} | Exp: {q['explanation']}",
                'reason': 'Convert ASCII W_0, Delta W = B * A, and r << d into KaTeX'
            })

        # q_ch08_29
        elif qid == 'q_ch08_29':
            orig_q = q['question']
            orig_opts = list(q['options'])
            orig_exp = q['explanation']
            q['question'] = "Can LoRA weights be merged directly back into the original base weights $W_0$ for zero-latency inference?"
            q['options'][1] = "Yes: $W_{\\text{new}} = W_0 + B \\cdot A$ can be computed once before deployment, incurring zero additional inference latency"
            q['explanation'] = "Because matrix addition is associative, $W_{\\text{new}} = W_0 + BA$ merges into a standard linear layer with zero inference overhead."
            corrections.append({
                'id': qid,
                'chapter': q['chapter'],
                'field': 'question, options[1], explanation',
                'before': f"Q: {orig_q} | Opt1: {orig_opts[1]} | Exp: {orig_exp}",
                'after': f"Q: {q['question']} | Opt1: {q['options'][1]} | Exp: {q['explanation']}",
                'reason': 'Convert ASCII W_0 and W_new = W_0 + B * A into KaTeX'
            })

        # q_ch09_14
        elif qid == 'q_ch09_14':
            orig_q = q['question']
            orig_opts = list(q['options'])
            orig_exp = q['explanation']
            q['question'] = "In Bahdanau attention, how is the dynamic context vector $c_i$ computed at decoder step $i$?"
            q['options'][0] = "As a weighted sum of encoder hidden states: $c_i = \\sum_{j=1}^{T_x} \\alpha_{ij} h_j$"
            q['explanation'] = "$c_i$ is the linear combination of encoder states $h_j$ weighted by alignment probabilities $\\alpha_{ij}$: $c_i = \\sum_{j=1}^{T_x} \\alpha_{ij} h_j$."
            corrections.append({
                'id': qid,
                'chapter': q['chapter'],
                'field': 'question, options[0], explanation',
                'before': f"Q: {orig_q} | Opt0: {orig_opts[0]} | Exp: {orig_exp}",
                'after': f"Q: {q['question']} | Opt0: {q['options'][0]} | Exp: {q['explanation']}",
                'reason': 'Convert raw pseudo-LaTeX c_i = SUM_{j=1}^Tx alpha_{ij} * h_j into KaTeX'
            })

        # q_ch09_16
        elif qid == 'q_ch09_16':
            orig_exp = q['explanation']
            q['explanation'] = "Attention weights $\\alpha_{ij}$ display an intuitive alignment map showing correspondences (e.g. French 'la maison blanche' to English 'the white house')."
            corrections.append({
                'id': qid,
                'chapter': q['chapter'],
                'field': 'explanation',
                'before': orig_exp,
                'after': q['explanation'],
                'reason': 'Convert raw pseudo-LaTeX alpha_{ij} into KaTeX $\\alpha_{ij}$'
            })

        # q_ch09_17
        elif qid == 'q_ch09_17':
            orig_q = q['question']
            orig_opts = list(q['options'])
            orig_exp = q['explanation']
            q['question'] = "In greedy decoding for NMT, how is the next word chosen at step $t$?"
            q['options'][2] = "Pick the single word with the HIGHEST probability: $w_t = \\operatorname{argmax}_w P(w \\mid y_{<t}, x)$"
            q['explanation'] = "Greedy search chooses the locally optimal token at each step ($w_t = \\operatorname{argmax}_w P(w \\mid y_{<t}, x)$), which may lead to globally sub-optimal translations."
            corrections.append({
                'id': qid,
                'chapter': q['chapter'],
                'field': 'question, options[2], explanation',
                'before': f"Q: {orig_q} | Opt2: {orig_opts[2]} | Exp: {orig_exp}",
                'after': f"Q: {q['question']} | Opt2: {q['options'][2]} | Exp: {q['explanation']}",
                'reason': 'Convert raw pseudo-LaTeX w_t = argmax P(w | y_{<t}, x) into KaTeX'
            })

        # q_ch11_12
        elif qid == 'q_ch11_12':
            orig_opts = list(q['options'])
            orig_exp = q['explanation']
            q['options'][2] = "Because nested combinations of PP-attachments and coordinations multiply combinatorially: $C_n = \\frac{(2n)!}{(n+1)! \\, n!}$"
            q['explanation'] = "Attachment ambiguities exhibit Catalan progression ($C_n = \\frac{(2n)!}{(n+1)! \\, n!}$); a sentence with 4 PPs can yield 14 trees, 5 PPs yield 42 trees, 10 PPs yield 16,796 trees."
            corrections.append({
                'id': qid,
                'chapter': q['chapter'],
                'field': 'options[2], explanation',
                'before': f"Opt2: {orig_opts[2]} | Exp: {orig_exp}",
                'after': f"Opt2: {q['options'][2]} | Exp: {q['explanation']}",
                'reason': 'Convert ASCII Catalan number formula C_n = (2n)! / ((n+1)! * n!) into KaTeX'
            })

        # q_ch11_28
        elif qid == 'q_ch11_28':
            orig_opts = list(q['options'])
            orig_exp = q['explanation']
            q['options'][3] = "A CFG where each production rule $A \\to \\alpha$ is assigned a conditional probability $P(\\alpha \\mid A)$ such that $\\sum P(\\alpha \\mid A) = 1$"
            q['explanation'] = "PCFGs augment CFG rules with probabilities, assigning a probability to each complete parse tree $T$: $P(T) = \\prod P(\\text{rule}_i)$."
            corrections.append({
                'id': qid,
                'chapter': q['chapter'],
                'field': 'options[3], explanation',
                'before': f"Opt3: {orig_opts[3]} | Exp: {orig_exp}",
                'after': f"Opt3: {q['options'][3]} | Exp: {q['explanation']}",
                'reason': 'Convert ASCII PCFG rule probability P(alpha | A) and SUM into KaTeX'
            })

        # q_ch11_29
        elif qid == 'q_ch11_29':
            orig_q = q['question']
            orig_opts = list(q['options'])
            orig_exp = q['explanation']
            q['question'] = "How is the probability of a complete parse tree $T$ calculated in a PCFG?"
            q['options'][1] = "The product of the probabilities of all production rules used in its derivation: $P(T) = \\prod_{r \\in T} P(r)$"
            q['explanation'] = "Under rule independence assumptions, the tree probability is the product of all constituent rule probabilities: $P(T) = \\prod_{r \\in T} P(r)$."
            corrections.append({
                'id': qid,
                'chapter': q['chapter'],
                'field': 'question, options[1], explanation',
                'before': f"Q: {orig_q} | Opt1: {orig_opts[1]} | Exp: {orig_exp}",
                'after': f"Q: {q['question']} | Opt1: {q['options'][1]} | Exp: {q['explanation']}",
                'reason': 'Convert raw pseudo-LaTeX P(T) = PROD_{r in T} P(r) into KaTeX $\\prod_{r \\in T} P(r)$'
            })

        # q_comp_051
        elif qid == 'q_comp_051':
            orig_opts = list(q['options'])
            orig_exp = q['explanation']
            q['options'] = [
                "$\\text{Attention}(Q, K, V) = \\text{softmax}\\left(\\frac{Q K^T}{\\sqrt{d_k}}\\right) V$",
                "$\\text{Attention} = \\frac{Q + K}{V}$",
                "$\\text{Attention} = Q K V$",
                "$\\text{Attention} = \\text{softmax}(Q) V$"
            ]
            q['explanation'] = "Scaled dot-product attention normalizes dot-product logits by the square root of key dimension before applying softmax: $\\text{Attention}(Q, K, V) = \\text{softmax}\\left(\\frac{Q K^T}{\\sqrt{d_k}}\\right) V$."
            corrections.append({
                'id': qid,
                'chapter': q['chapter'],
                'field': 'options, explanation',
                'before': f"Opt0: {orig_opts[0]} | Exp: {orig_exp}",
                'after': f"Opt0: {q['options'][0]} | Exp: {q['explanation']}",
                'reason': 'Convert comprehensive question Scaled Dot-Product Attention ASCII formula into KaTeX'
            })

        # q_comp_052
        elif qid == 'q_comp_052':
            orig_q = q['question']
            orig_exp = q['explanation']
            q['question'] = "Why does the Transformer divide dot products $Q K^T$ by the scaling factor $\\sqrt{d_k}$?"
            q['explanation'] = "Large dimensions inflate dot products, driving softmax into flat regions with near-zero gradients during backpropagation."
            corrections.append({
                'id': qid,
                'chapter': q['chapter'],
                'field': 'question, explanation',
                'before': f"Q: {orig_q} | Exp: {orig_exp}",
                'after': f"Q: {q['question']} | Exp: {q['explanation']}",
                'reason': 'Convert ASCII Q * K^T and sqrt(d_k) into KaTeX'
            })

        # q_comp_063
        elif qid == 'q_comp_063':
            orig_opts = list(q['options'])
            orig_exp = q['explanation']
            q['options'][0] = "It freezes pre-trained model weights and injects trainable rank-decomposition matrices $\\Delta W = B \\cdot A$ with rank $r \\ll d$ into linear layers"
            q['explanation'] = "LoRA achieves full fine-tuning performance while training < 1% of parameters by updating low-rank decomposition matrices $\\Delta W = B \\cdot A$."
            corrections.append({
                'id': qid,
                'chapter': q['chapter'],
                'field': 'options[0], explanation',
                'before': f"Opt0: {orig_opts[0]} | Exp: {orig_exp}",
                'after': f"Opt0: {q['options'][0]} | Exp: {q['explanation']}",
                'reason': 'Convert ASCII Delta W = B * A and r << d into KaTeX'
            })

    # Write updated questions.json
    with open(QUESTIONS_PATH, 'w', encoding='utf-8') as f:
        json.dump(questions, f, ensure_ascii=False, indent=2)
    
    print(f"Questions remediated: {len(corrections)} questions updated.")
    return corrections

def remediate_knowledge():
    with open(KNOWLEDGE_PATH, 'r', encoding='utf-8') as f:
        knowledge = json.load(f)

    corrections = []

    # 1. Fix slide title typos in reference objects and content HTML
    ref_typos = [
        ('1', 2, 'Regular Experession', 'Regular Expression', 'Fix typo in Slide 6–10 reference title (Experession -> Expression)'),
        ('2', 1, 'N-Gram Languages Model', 'N-Gram Language Models', 'Fix typo in Slide 1–3 reference title (Languages Model -> Language Models)'),
        ('3', 3, 'Navie Bayes Algorithm', 'Naive Bayes Algorithm', 'Fix typo in Slide 7–9 reference title (Navie -> Naive)'),
        ('3', 5, 'Navie Bayes to SA', 'Naive Bayes to SA', 'Fix typo in Slide 13–15 reference title (Navie -> Naive)'),
        ('13', 1, 'Locial Representations of Sentences Meaning', 'Logical Representations of Sentence Meaning', 'Fix typo in Slide 1–5 reference title (Locial -> Logical)')
    ]

    for ch_id, ref_id, old_t, new_t, reason in ref_typos:
        ch = knowledge[ch_id]
        for r in ch['references']:
            if r['id'] == ref_id and r['title'] == old_t:
                r['title'] = new_t
                corrections.append({
                    'id': f"knowledge_ch{ch_id}_ref{ref_id}",
                    'chapter': ch_id,
                    'field': f"references[{ref_id}].title",
                    'before': old_t,
                    'after': new_t,
                    'reason': reason
                })
        # also update title in content_html if present
        if old_t in ch['content_html']:
            ch['content_html'] = ch['content_html'].replace(old_t, new_t)
            corrections.append({
                'id': f"knowledge_ch{ch_id}_content",
                'chapter': ch_id,
                'field': 'content_html',
                'before': f'title="...: {old_t}"',
                'after': f'title="...: {new_t}"',
                'reason': f"Update citation link title to match corrected reference title: {new_t}"
            })

    # 2. Standardize <a class="cite-ref"> in Chapters 4, 7, 11
    target_chapters = ['4', '7', '11']
    for ch_id in target_chapters:
        ch = knowledge[ch_id]
        html = ch['content_html']
        ref_map = {r['id']: r for r in ch['references']}

        def replace_cite(match):
            rid = int(match.group(1))
            r = ref_map.get(rid)
            if not r:
                return match.group(0)
            slide_range = r['slide_range']
            title = r['title']
            return f'<a href="#ref-{rid}" class="cite-ref" data-ref="{rid}" title="{slide_range}: {title}">[{rid}]</a>'

        old_cites = re.findall(r'<a class="cite-ref" href="#ref-(\d+)">\[\d+\]</a>', html)
        if old_cites:
            new_html = re.sub(r'<a\s+class="cite-ref"\s+href="#ref-(\d+)">\[\d+\]</a>', replace_cite, html)
            ch['content_html'] = new_html
            corrections.append({
                'id': f"knowledge_ch{ch_id}_cites",
                'chapter': ch_id,
                'field': 'content_html (citations)',
                'before': f'{len(old_cites)} unstandardized cite tags: <a class="cite-ref" href="#ref-X">[X]</a>',
                'after': f'Standardized with data-ref="X" and title="{ref_map[1]["slide_range"]}: ..."',
                'reason': f'Standardize Chapter {ch_id} citations with data-ref and descriptive title attributes'
            })

    with open(KNOWLEDGE_PATH, 'w', encoding='utf-8') as f:
        json.dump(knowledge, f, ensure_ascii=False, indent=2)

    print(f"Knowledge remediated: {len(corrections)} entries updated.")
    return corrections

if __name__ == '__main__':
    q_corr = remediate_questions()
    k_corr = remediate_knowledge()
    print("Remediation complete!")
