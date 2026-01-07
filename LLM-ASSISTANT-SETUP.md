# LLM-Powered Assistant Setup Guide

This guide explains how to set up the LLM-powered assistant that explains business recommendations.

## Overview

The AI assistant uses either OpenAI or Anthropic (Claude) API to explain system-generated business recommendations. It **only reasons over provided metrics and decision context** - it does not access raw data or make guesses.

## Features

- ✅ Explains recommendations from the Decision Feed
- ✅ Answers questions about why recommendations were made
- ✅ Provides implementation guidance based on provided context
- ✅ Only uses metrics and data from recommendations (no raw data access)
- ✅ Supports both OpenAI and Claude APIs

## Setup Instructions

### Option 1: Using OpenAI (Recommended)

1. **Get an OpenAI API Key:**
   - Go to [OpenAI Platform](https://platform.openai.com/)
   - Sign up or log in
   - Navigate to API Keys section
   - Create a new API key

2. **Add to Environment Variables:**
   ```env
   OPENAI_API_KEY=sk-your-api-key-here
   ```

3. **Model Used:**
   - Default: `gpt-4o-mini` (cost-effective)
   - Can be changed to `gpt-4` or `gpt-3.5-turbo` in `app/api/chat/route.ts`

### Option 2: Using Anthropic (Claude)

1. **Get an Anthropic API Key:**
   - Go to [Anthropic Console](https://console.anthropic.com/)
   - Sign up or log in
   - Navigate to API Keys
   - Create a new API key

2. **Add to Environment Variables:**
   ```env
   ANTHROPIC_API_KEY=sk-ant-your-api-key-here
   ```

3. **Model Used:**
   - Default: `claude-3-5-sonnet-20241022`
   - Can be changed to `claude-3-opus-20240229` for better quality

## How It Works

### 1. **Context Building**
When a user asks a question, the system:
- Fetches the user's recent recommendations from the database
- Extracts key metrics: title, type, priority, projected impact, ROI, description, implementation steps
- Builds a structured context string with only this information

### 2. **LLM Prompt**
The system sends:
- **System Prompt**: Instructions to only use provided context, not guess
- **Recommendation Context**: Structured data from recommendations
- **User Message**: The user's question

### 3. **Response Generation**
The LLM:
- Analyzes the recommendation context
- Explains why recommendations were made (based on provided metrics)
- Provides implementation guidance (using provided steps)
- Answers questions about impact and ROI (using provided values)
- **Never** invents data or accesses raw data

## API Route

The assistant is implemented in `app/api/chat/route.ts`:

- **Endpoint**: `/api/chat`
- **Method**: POST
- **Request Body**:
  ```json
  {
    "messages": [
      { "role": "user", "content": "Why was this recommendation made?" }
    ],
    "userId": "user-uuid"
  }
  ```
- **Response**:
  ```json
  {
    "response": "Based on the recommendation context...",
    "recommendationsCount": 3
  }
  ```

## Security

- API keys are stored in environment variables (never in code)
- User ID is required to fetch only that user's recommendations
- No raw data is sent to the LLM - only structured recommendation metrics
- All API calls are server-side only

## Cost Considerations

### OpenAI Pricing (as of 2024):
- `gpt-4o-mini`: ~$0.15 per 1M input tokens, ~$0.60 per 1M output tokens
- `gpt-3.5-turbo`: ~$0.50 per 1M input tokens, ~$1.50 per 1M output tokens
- `gpt-4`: ~$30 per 1M input tokens, ~$60 per 1M output tokens

### Anthropic Pricing (as of 2024):
- `claude-3-5-sonnet`: ~$3 per 1M input tokens, ~$15 per 1M output tokens
- `claude-3-opus`: ~$15 per 1M input tokens, ~$75 per 1M output tokens

**Recommendation**: Start with `gpt-4o-mini` for cost-effectiveness, or `claude-3-5-sonnet` for better quality.

## Testing

1. **Test the API directly:**
   ```bash
   curl -X POST http://localhost:3000/api/chat \
     -H "Content-Type: application/json" \
     -d '{
       "messages": [{"role": "user", "content": "Explain my recommendations"}],
       "userId": "your-user-id"
     }'
   ```

2. **Test in the dashboard:**
   - Go to `/dashboard`
   - Open the AI Chatbot section
   - Ask: "Why was the recommendation to increase ad budget made?"
   - The assistant should explain based on the recommendation's metrics

## Troubleshooting

### Error: "No LLM API key configured"
- **Solution**: Add `OPENAI_API_KEY` or `ANTHROPIC_API_KEY` to your `.env.local` file

### Error: "OpenAI API error" or "Anthropic API error"
- **Solution**: Check that your API key is valid and has credits/quota

### Assistant gives generic responses
- **Solution**: Ensure recommendations exist in the database for the user
- Check that recommendation data includes metrics (projected_impact, description, etc.)

### Assistant makes up data
- **Solution**: The system prompt enforces using only provided context. If this happens, check the system prompt in `app/api/chat/route.ts`

## Example Questions Users Can Ask

- "Why was the recommendation to increase ad budget by 15% made?"
- "What impact will this recommendation have?"
- "How do I implement the inventory reduction recommendation?"
- "Explain the projected ROI for this recommendation"
- "What does 'High Impact • Low Risk' mean for this recommendation?"

## Future Enhancements

- Add conversation history persistence
- Support for asking about specific recommendations by ID
- Integration with more recommendation metadata
- Support for multiple languages
- Rate limiting to control API costs

