
import { GoogleGenAI, Type } from '@google/genai';
import { AnalysisResult, ContentType } from '../types';

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

// Helper to create simple score schema
const createScoreSchema = (detailsProps?: Record<string, any>): any => {
    const schema: any = {
        type: Type.OBJECT,
        properties: {
            score: { type: Type.INTEGER, description: "0-100" },
            summary: { type: Type.STRING },
            recommendations: { type: Type.ARRAY, items: { type: Type.STRING } },
        },
        required: ['score', 'summary', 'recommendations']
    };
    if (detailsProps) {
        schema.properties.details = {
            type: Type.OBJECT,
            properties: detailsProps,
            required: Object.keys(detailsProps),
            nullable: true
        };
    }
    return schema;
};

// --- Detailed Schemas ---

const seoDetails = {
    readabilityScore: { type: Type.INTEGER },
    readingGrade: { type: Type.STRING },
    keywordDensity: { type: Type.STRING },
};

const serpDetails = {
    rankingPotentialScore: { type: Type.INTEGER }, // 0-100
    estimatedPosition: { type: Type.STRING }, // e.g., "#4"
    rankingConfidence: { type: Type.STRING }, // "85%"
};

const differentiationMetricsSchema = {
    type: Type.OBJECT,
    properties: {
        uniquenessScore: { type: Type.INTEGER },
        uniqueValueProps: { type: Type.ARRAY, items: { type: Type.STRING } },
        semanticSimilarity: {
            type: Type.ARRAY,
            items: {
                type: Type.OBJECT,
                properties: {
                    competitorName: { type: Type.STRING },
                    similarPercentage: { type: Type.INTEGER },
                    uniquePercentage: { type: Type.INTEGER },
                }
            }
        },
        contentOverlap: {
            type: Type.OBJECT,
            properties: {
                sharedTopics: { type: Type.INTEGER },
                uniqueTopics: { type: Type.INTEGER },
                totalTopics: { type: Type.INTEGER },
                overlapPercentage: { type: Type.INTEGER },
            }
        },
        angleRecommendations: {
            type: Type.ARRAY,
            items: {
                type: Type.OBJECT,
                properties: {
                    title: { type: Type.STRING },
                    potentialScore: { type: Type.INTEGER },
                    competitionLevel: { type: Type.STRING, enum: ['Low', 'Medium', 'High'] },
                    description: { type: Type.STRING }
                }
            }
        }
    }
};

const contentGapSchema = {
    type: Type.ARRAY,
    items: {
        type: Type.OBJECT,
        properties: {
            topic: { type: Type.STRING },
            userCoverage: { type: Type.INTEGER }, // 0-100
            competitorCoverage: { type: Type.INTEGER } // 0-100
        }
    }
};

const keywordMetricsSchema = {
    type: Type.ARRAY,
    items: {
        type: Type.OBJECT,
        properties: {
            keyword: { type: Type.STRING },
            density: { type: Type.STRING },
            status: { type: Type.STRING, enum: ['Optimal', 'High', 'Low'] },
            count: { type: Type.INTEGER }
        }
    }
};

// New Schemas for requested details
const headingStructureSchema = {
    type: Type.ARRAY,
    items: {
        type: Type.OBJECT,
        properties: {
            tag: { type: Type.STRING, enum: ['H1', 'H2', 'H3', 'H4'] },
            count: { type: Type.INTEGER },
            status: { type: Type.STRING, enum: ['Optimal', 'Good', 'Warning', 'Missing'] }
        }
    }
};

const metaDescriptionSchema = {
    type: Type.OBJECT,
    properties: {
        length: { type: Type.INTEGER },
        status: { type: Type.STRING, enum: ['Optimal', 'Too Short', 'Too Long', 'Missing'] },
        preview: { type: Type.STRING }
    }
};

const voiceSearchSchema = {
    type: Type.OBJECT,
    properties: {
        questionFormatScore: { type: Type.INTEGER },
        conversationalToneScore: { type: Type.INTEGER },
        snippetPotentialScore: { type: Type.INTEGER }
    }
};

// Humanization Sub-Schemas
const aiPatternsSchema = {
    type: Type.ARRAY,
    items: {
        type: Type.OBJECT,
        properties: {
            pattern: { type: Type.STRING },
            status: { type: Type.STRING, enum: ['Detected', 'Not Detected'] },
            confidence: { type: Type.INTEGER }
        }
    }
};

const sentenceComplexitySchema = {
    type: Type.OBJECT,
    properties: {
        varietyScore: { type: Type.INTEGER },
        avgLength: { type: Type.INTEGER },
        simplePercent: { type: Type.INTEGER },
        compoundPercent: { type: Type.INTEGER },
        complexPercent: { type: Type.INTEGER },
        compoundComplexPercent: { type: Type.INTEGER }
    }
};

const toneVoiceSchema = {
    type: Type.OBJECT,
    properties: {
        primaryTone: { type: Type.STRING },
        secondaryTone: { type: Type.STRING },
        consistencyScore: { type: Type.INTEGER },
        appropriatenessScore: { type: Type.INTEGER },
        characteristics: { type: Type.ARRAY, items: { type: Type.STRING } }
    }
};

const conversationalSchema = {
    type: Type.OBJECT,
    properties: {
        score: { type: Type.INTEGER },
        activeVoicePercent: { type: Type.INTEGER },
        pronounsCount: { type: Type.STRING },
        contractionsCount: { type: Type.INTEGER }
    }
};

// Main Schema
const responseSchema: any = {
    type: Type.OBJECT,
    properties: {
        contentType: { type: Type.STRING, enum: ['article', 'video'] },
        topic: { type: Type.STRING },
        speechReview: { type: Type.STRING },
        
        seo: createScoreSchema(seoDetails),
        serp: createScoreSchema(serpDetails),
        aeo: createScoreSchema(),
        humanization: createScoreSchema({ 
            humanLikelihood: { type: Type.INTEGER },
            naturalFlow: { type: Type.INTEGER },
            smoothness: { type: Type.INTEGER },
            coherence: { type: Type.INTEGER },
            transitions: { type: Type.INTEGER },
            perplexity: { type: Type.STRING }
        }),
        differentiation: createScoreSchema(),
        
        // Detailed Visual Data
        differentiationMetrics: differentiationMetricsSchema,
        contentGaps: contentGapSchema,
        keywords: keywordMetricsSchema,
        
        // New Specific Data
        headingStructure: headingStructureSchema,
        metaDescription: metaDescriptionSchema,
        voiceSearch: voiceSearchSchema,
        
        // Extended Humanization Data
        aiPatterns: aiPatternsSchema,
        sentenceComplexity: sentenceComplexitySchema,
        toneVoice: toneVoiceSchema,
        conversational: conversationalSchema,

        // Base Stats
        wordCount: { type: Type.INTEGER },
        readingLevel: { type: Type.STRING },
        
        // Simplified Dimensions
        freshness: createScoreSchema(),
        engagement: createScoreSchema(),
        linking: createScoreSchema(),
        accessibility: createScoreSchema(),
        tone: createScoreSchema({ primaryTone: { type: Type.STRING }, consistencyScore: { type: Type.INTEGER } }),
        contentDepth: createScoreSchema(),
        sentiment: createScoreSchema(),
        
        // Video
        hook: createScoreSchema({ hookImpact: { type: Type.STRING }, retentionScore: { type: Type.INTEGER } }),
        caption: createScoreSchema(),
        hashtags: createScoreSchema(),
        visuals: createScoreSchema({ visualPacing: { type: Type.STRING } }),
        trend: createScoreSchema(),

        overall: {
            type: Type.OBJECT,
            properties: {
                score: { type: Type.INTEGER },
                summary: { type: Type.STRING }
            },
            required: ['score', 'summary']
        },
    },
    required: ['contentType', 'overall', 'seo']
};

const createPrompt = (content: string, contentType: ContentType, keywords: string, activeDimensions: string[]) => {
  const dimensionList = activeDimensions.length > 0 ? activeDimensions.join(', ') : 'all standard metrics';
  return `
    You are GritGrade V3.1. Analyze this ${contentType}.
    Target Keywords: "${keywords || 'Auto-detect'}".
    
    **PRIORITY INSTRUCTIONS:**
    Analyze and generate scores/recommendations specifically for these dimensions: ${dimensionList}.
    
    **HUMANIZATION ANALYSIS DETAILS:**
    - Detect specific AI patterns: "Repetitive phrasing", "Unnatural transitions", "Robotic sentence structure", "Generic conclusions".
    - Calculate Sentence Complexity: % of simple, compound, complex sentences.
    - Analyze Tone: Define primary/secondary tone and consistency.
    - Check Conversational: Active voice usage %, contractions found.

    **DIFFERENTIATION ANALYSIS DETAILS:**
    - Compare semantic similarity with hypothetical top competitors (Competitor 1, 2, 3).
    - Suggest 3 specific "Content Angle Recommendations" that would rank better (e.g. "Technical SEO Deep Dive" vs "General Guide"). Give each a potential score and competition level.

    Crucial Requirements:
    1. **Visual Data**: Generate data for charts matching the "GritGrade" dashboard.
    2. **SEO Details**: Count H1, H2, H3 tags exactly. Estimate Meta Description length. 
    3. **AEO**: Evaluate Voice Search Potential (Question format, conversational tone).
    4. **Recommendations**: Provide 3-5 actionable recommendations for *each* requested dimension.
    5. **Differentiation**: Compare against hypothetical top competitors.

    Content:
    ${content.substring(0, 15000)}
  `;
};

export const analyzeContent = async (
  content: string, 
  inputType: 'text' | 'url', 
  contentType: ContentType,
  keywords: string = '',
  activeDimensions: string[] = []
): Promise<AnalysisResult> => {
  try {
    const prompt = createPrompt(content, contentType, keywords, activeDimensions);

    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: prompt,
      config: {
        responseMimeType: 'application/json',
        responseSchema: responseSchema,
      },
    });
    
    const text = response.text.trim();
    const cleanText = text.replace(/^```json\s*|```\s*$/g, ''); 
    const result = JSON.parse(cleanText) as AnalysisResult;
    
    result.contentType = contentType;
    // Default to 2000 if missing
    if (!result.recommendedWordCount) result.recommendedWordCount = 2000; 

    return result;

  } catch (error) {
    console.error("Error analyzing content:", error);
    throw new Error("Failed to analyze content.");
  }
};
