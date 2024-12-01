import openai

# Replace with your API key
openai.api_key = "AIzaSyCIP7chBEupxWpykZoVDW-R54CXPumx-tA"

def chatbot(messages):
    try:
        # Make a request to the OpenAI API using the correct endpoint for chat completions
        response = openai.ChatCompletion.create(
            model="gemini-1.5-flash",  # Updated model
            messages=messages,
            max_tokens=150,
            temperature=0.7,
        )
        # Extract and return the response text
        return response.choices[0].message['content'].strip()
    except Exception as e:
        return f"Error: {str(e)}"

def main():
    print("Welcome to the Chatbot! Type 'exit' to end the conversation.")
    messages = [{"role": "system", "content": "You are a helpful assistant."}]
    
    while True:
        user_input = input("You: ")
        if user_input.lower() == "exit":
            print("Goodbye!")
            break
        messages.append({"role": "user", "content": user_input})
        response = chatbot(messages)
        print(f"Bot: {response}")
        messages.append({"role": "assistant", "content": response})

if __name__ == "__main__":
    main()
