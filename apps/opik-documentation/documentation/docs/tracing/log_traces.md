---
sidebar_position: 1
sidebar_label: Log Traces
---

# Log Traces

You can log traces to the Comet LLM Evaluation plaform using either the REST API or the `opik` Python SDK.

## Using the Python SDK

To log traces to the Comet LLM Evaluation platform using the Python SDK, you will first need to install the SDK:

```bash
pip install opik
```

Once the SDK is installed, you can log traces to using one our Comet's integration, function decorators or manually.

:::tip
Opik has a number of integrations for popular LLM frameworks like LangChain or OpenAI, checkout a full list of integrations in the [integrations](/tracing/integrations/overview.md) section.
:::

## Log using function decorators

### Logging traces and spans

If you are manually defining your LLM chains and not using LangChain for example, you can use the `track` function decorators to track LLM calls:

```python
from opik import track
import openai
from opik.integrations.openai import track_openai

openai_client = track_openai(openai.OpenAI())

@track
def preprocess_input(text):
    return text.strip().lower()

@track
def generate_response(prompt):
    response = openai_client.chat.completions.create(
        model="gpt-3.5-turbo",
        messages=[{"role": "user", "content": prompt}]
    )
    return response.choices[0].message.content

@track
def postprocess_output(response):
    return response.capitalize()

@track(name="my_llm_application)
def llm_chain(input_text):
    preprocessed = preprocess_input(input_text)
    generated = generate_response(preprocessed)
    postprocessed = postprocess_output(generated)
    return postprocessed

# Use the LLM chain
result = llm_chain("Hello, how are you?")
print(result)
```

:::tip
If the `track` function decorators are used in conjunction with the `track_openai` or `CometTracer` callbacks, the LLM calls will be automatically logged to the corresponding trace.
:::

### Capturing inputs and ouputs

By default the `track` decorator will capture the input and output of the function you are decorating and will map these to the input and output of the span. You can control what is captured using the `capture_input` and `capture_output` parameters.

For example, if you don't want to capture the input and output of the function you can do:

```python
from opik import track
from opik.opik_context import update_current_span

@track(capture_input=False, capture_output=False)
def my_function(input_text):
    res = input_text.upper()

    # Manually update the span with the input and output
    update_current_span(input={"text": input_text}, output={"text": input_text.upper()})
    return res
```

## Log traces and spans manually

If you wish to log traces and spans manually, you can use the `Comet` client:

```python
from opik import Opik

client = Opik(project_name="test")

# Create a trace
trace = client.trace(
    name="my_trace",
    input={"user_question": "Hello, how are you?"},
    output={"response": "Comment ça va?"}
)

# Add a span
trace.span(
    name="Add prompt template",
    input={"text": "Hello, how are you?", "prompt_template": "Translate the following text to French: {text}"},
    output={"text": "Translate the following text to French: hello, how are you?"}
)

# Add an LLM call
trace.span(
    name="llm_call",
    type="llm",
    input={"prompt": "Translate the following text to French: hello, how are you?"},
    output={"response": "Comment ça va?"}
)

# End the trace
trace.end()
```

## Update trace and span attributes

You can access the Trace and Span objects to update their attributes. This is useful if you want to update the metadata attributes or log scores to a trace or span during the execution of the trace. This is achieved by using the `update_current_trace` and `update_current_span` functions:

```python
from opik import track, opik_context

@track
def llm_chain(input_text):
    # LLM chain code
    # ...

    # Update the trace
    opik_context.update_current_trace(
        tags=["llm_chatbot"],
        feedback_scores=[
            {"name": "user_feedback", "value": 1.0, "reason": "The response was helpful and accurate."}
        ]
    )
    
    # Update the span
    opik_context.update_current_span(
        name="llm_chain"
    )
```

You can learn more about the `Trace` object in the [Trace reference docs](/python-sdk-reference/Objects/Trace.html) and the `Span` object in the [Span reference docs](/python-sdk-reference/Objects/Span.html).

## Log scores to traces and spans

You can log scores to traces and spans using the `log_traces_feedback_scores` and `log_spans_feedback_scores` methods:

```python
from opik import Opik

client = Opik()

trace = client.trace(name="my_trace")

client.log_traces_feedback_scores(
    scores=[
        {"id": trace.id, "name": "overall_quality", "value": 0.85, "reason": "The response was helpful and accurate."},
        {"id": trace.id, "name": "coherence", "value": 0.75}
    ]
)

span = trace.span(name="my_span")
client.log_spans_feedback_scores(
    scores=[
        {"id": span.id, "name": "overall_quality", "value": 0.85, "reason": "The response was helpful and accurate."},
        {"id": span.id, "name": "coherence", "value": 0.75}
    ]
)
```

:::tip
If you want to log scores to traces or spans from within a decorated function, you can use the `update_current_trace` and `update_current_span` methods instead.
:::

## Advanced usage

Comet's logging functionality is designed with production environments in mind. To optimize performance, all logging operations are executed in a background thread.

If you want to ensure all traces are logged to Comet before exiting your program, you can use the `Comet.flush` method:

```python
from opik import Opik

client = Opik()

# Log some traces
client.flush()
```