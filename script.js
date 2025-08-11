document.addEventListener('DOMContentLoaded', function() {
    // DOM Elements
    const emailText = document.getElementById('email-text');
    const detectBtn = document.getElementById('detect-btn');
    const resultDiv = document.getElementById('result');
    const resultIcon = document.getElementById('result-icon');
    const resultText = document.getElementById('result-text');
    const confidenceLevel = document.getElementById('confidence-level');
    const confidenceValue = document.getElementById('confidence-value');

    // 100+ Spam Detection Parameters (AI Features)
    const spamFeatures = {
        // 1. Keyword Patterns (50 parameters)
        keywords: {
            'win': 4.2, 'free': 4.0, 'prize': 3.9, 'congratulations': 3.8,
            'claim': 3.7, 'selected': 3.6, 'cash': 3.5, 'urgent': 3.4,
            'ticket': 3.3, 'reward': 3.3, 'call': 3.2, 'number': 3.1,
            'click': 4.1, 'here': 3.0, 'loan': 3.9, 'approved': 3.2,
            'winner': 3.8, 'guaranteed': 3.6, 'limited': 3.4, 'offer': 3.3,
            'discount': 3.2, 'exclusive': 3.1, 'deal': 3.0, 'save': 2.9,
            'expire': 3.1, 'now': 3.0, 'only': 2.9, 'today': 3.0,
            'apply': 3.1, 'instant': 3.2, 'risk-free': 3.3, 'special': 3.0,
            'bonus': 3.2, 'credit': 3.3, 'card': 3.1, 'money': 3.4,
            'million': 3.5, 'dollar': 3.3, 'price': 2.9, 'cost': 2.8,
            'cheap': 3.0, 'bargain': 2.9, 'income': 3.1, 'profit': 3.2,
            'earn': 3.3, 'extra': 3.0, 'hidden': 3.1, 'secret': 3.2,
            'trick': 3.3, 'method': 3.1, 'system': 3.0
        },

        // 2. Domain Patterns (20 parameters)
        domains: {
            '.ru': 4.0, '.top': 3.5, '.xyz': 3.4, '.info': 3.2,
            '.biz': 3.3, '.club': 3.1, '.online': 3.0, '.site': 3.1,
            'free': 3.2, 'win': 3.3, 'prize': 3.4, 'offer': 3.1,
            'discount': 3.0, 'deal': 2.9, 'cash': 3.2, 'money': 3.1,
            'credit': 3.0, 'loan': 3.3, 'bank': 2.8, 'pay': 3.0
        },

        // 3. Structural Features (30 parameters)
        structural: {
            excessiveCaps: 3.5,
            multipleExclamations: 3.4,
            shortLinks: 4.0,
            ipAddress: 3.8,
            unusualChars: 3.2,
            noPersonalization: 2.8,
            urgentLanguage: 3.6,
            moneyAmounts: 3.3,
            phoneNumbers: 3.2,
            suspiciousFrom: 3.5,
            mismatchedLinks: 3.9,
            htmlImagesOnly: 3.1,
            badGrammar: 2.9,
            foreignChars: 3.0,
            hiddenText: 4.1,
            fakeBrands: 3.8,
            fakeUrgency: 3.7,
            unsubscribeMissing: 3.0,
            replyToMismatch: 3.2,
            fromNameMismatch: 3.3,
            suspiciousHeaders: 3.6,
            unusualHour: 3.1,
            bulkIndicator: 3.2,
            noPhysicalAddress: 2.7,
            fakeTestimonials: 3.0,
            tooGoodToBeTrue: 3.5,
            illegalClaims: 4.0,
            hiddenUnsubscribe: 3.8,
            imageOnlyContent: 3.2,
            suspiciousAttachments: 3.9
        }
    };

    // AI Model Configuration
    const AI_CONFIG = {
        spamThreshold: 0.75, // More conservative threshold
        bias: -2.3, // Model bias
        featureWeights: {
            keywords: 0.5,
            domains: 0.3,
            structural: 0.2
        },
        internetChecks: {
            domainAgeThreshold: 365, // 1 year
            domainReputationAPI: false // Would use API in production
        }
    };

    detectBtn.addEventListener('click', async function() {
        const text = emailText.value.trim();
        
        if (!text) {
            alert('Please enter email content to analyze');
            return;
        }

        // AI Processing
        resultDiv.classList.remove('hidden', 'spam', 'ham');
        resultDiv.classList.add('loading');
        resultIcon.className = 'fas fa-spinner';
        resultText.textContent = 'Running AI analysis...';

        try {
            // Simulate network delay for internet checks
            const prediction = await analyzeEmailWithAI(text);
            
            // Display AI results
            showResults(prediction);
        } catch (error) {
            console.error("AI analysis failed:", error);
            resultText.textContent = "Analysis failed. Please try again.";
            resultIcon.className = 'fas fa-exclamation-circle';
            resultDiv.classList.remove('loading');
        }
    });

    // Advanced AI Email Analysis
    async function analyzeEmailWithAI(text) {
        // 1. Extract Features
        const features = extractFeatures(text);
        
        // 2. Calculate Scores (Neural Network-like calculation)
        let spamScore = AI_CONFIG.bias;
        
        // Keyword Score
        let keywordScore = 0;
        Object.entries(spamFeatures.keywords).forEach(([word, weight]) => {
            const regex = new RegExp(`\\b${word}\\b`, 'gi');
            const count = (text.match(regex) || []).length;
            keywordScore += count * weight;
        });
        
        // Domain Score
        let domainScore = 0;
        if (extractDomain(text)) {
            Object.entries(spamFeatures.domains).forEach(([domain, weight]) => {
                if (text.toLowerCase().includes(domain)) {
                    domainScore += weight;
                }
            });
        }
        
        // Structural Score
        let structuralScore = 0;
        structuralScore += countExcessiveCaps(text) * spamFeatures.structural.excessiveCaps;
        structuralScore += countExclamations(text) * spamFeatures.structural.multipleExclamations;
        structuralScore += detectShortLinks(text) * spamFeatures.structural.shortLinks;
        structuralScore += detectUrgentLanguage(text) * spamFeatures.structural.urgentLanguage;
        // ... add all structural features
        
        // 3. Combine Scores with Weights
        spamScore += (keywordScore * AI_CONFIG.featureWeights.keywords);
        spamScore += (domainScore * AI_CONFIG.featureWeights.domains);
        spamScore += (structuralScore * AI_CONFIG.featureWeights.structural);
        
        // 4. Apply Sigmoid Activation
        const probability = 1 / (1 + Math.exp(-spamScore));
        
        return {
            isSpam: probability >= AI_CONFIG.spamThreshold,
            confidence: probability,
            features: features
        };
    }

    // Feature Extraction Functions
    function extractFeatures(text) {
        return {
            length: text.length,
            wordCount: text.split(/\s+/).length,
            hasUrls: (text.match(/https?:\/\/[^\s]+/g) || []).length,
            hasPhone: (text.match(/(\+?\d{1,3}[- ]?)?\(?\d{3}\)?[- ]?\d{3}[- ]?\d{4}/g) || []).length,
            excessiveCaps: countExcessiveCaps(text),
            exclamations: countExclamations(text),
            shortLinks: detectShortLinks(text),
            urgentLanguage: detectUrgentLanguage(text),
            // ... add all other features
        };
    }

    // Helper Functions
    function countExcessiveCaps(text) {
        const caps = text.match(/[A-Z]/g) || [];
        const total = text.match(/[A-Za-z]/g) || [];
        return total.length > 10 ? caps.length / total.length : 0;
    }

    function countExclamations(text) {
        return (text.match(/!/g) || []).length;
    }

    function detectShortLinks(text) {
        return (text.match(/\b(bit\.ly|goo\.gl|tinyurl|t\.co|ow\.ly)\b/i) || []).length;
    }

    function detectUrgentLanguage(text) {
        const urgentWords = ['urgent', 'immediately', 'right away', 'act now', 'limited time'];
        return urgentWords.filter(word => text.toLowerCase().includes(word)).length;
    }

    function extractDomain(text) {
        const urlMatch = text.match(/https?:\/\/([^\/]+)/i);
        return urlMatch ? urlMatch[1] : null;
    }

    function showResults(prediction) {
        resultDiv.classList.remove('loading');
        
        if (prediction.isSpam) {
            resultDiv.classList.add('spam');
            resultIcon.className = 'fas fa-exclamation-triangle';
            resultText.textContent = '⚠️ AI Detected: HIGH PROBABILITY SPAM';
        } else {
            resultDiv.classList.add('ham');
            resultIcon.className = 'fas fa-check-circle';
            resultText.textContent = '✅ AI Verified: Legitimate Email';
        }
        
        const confidence = prediction.confidence * 100;
        confidenceLevel.style.width = `${confidence}%`;
        confidenceValue.textContent = `${confidence.toFixed(1)}% confidence`;
        
        // Show advanced features in console (would show in UI in production)
        console.log("AI Detection Features:", prediction.features);
    }

    // Internet-based Checks (Simulated - would use APIs in production)
    async function checkDomainReputation(domain) {
        // In production: Call WHOIS API, Google Safe Browsing, etc.
        return new Promise(resolve => {
            setTimeout(() => {
                resolve({
                    ageDays: Math.random() > 0.7 ? 100 : 400,
                    isBlacklisted: Math.random() > 0.9
                });
            }, 500);
        });
    }
});