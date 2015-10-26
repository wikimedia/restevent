{
    "title": "MediaWiki Article Delete",
    "description": "Represents a MW Article Delete Edit event",
    "type": "object",
    "properties": {
        // global event fields
        "uri": {
            "type": "string",
            "format": "uri",
            "description": "the unique URI identifying the event"
        },
        "request_id": {
            "type": "string",
            "pattern": "^[a-fA-F0-9]{8}(-[a-fA-F0-9]{4}){3}-[a-fA-F0-9]{12}$",
            "description": "the unique UUID v1 ID of the event derived from the X-Request-Id header"
        },
        "event_id": {
            "type": "string",
            "pattern": "^[a-fA-F0-9]{8}(-[a-fA-F0-9]{4}){3}-[a-fA-F0-9]{12}$",
            "description": "the unique ID of this event; added by the event bus"
        },
        "event_ts": {
            "type": "string",
            "format": "date-time",
            "description": "the time stamp of the event, in ISO8601 format"
        },
        "domain": {
            "type": "string",
            "description": "the domain the event pertains to"
        },
        // event-specific fields
        "title": {
            "type": "string",
            "description": "the title of the article"
        },
        "page_id": {
            "type": "integer",
            "minimum": 1,
            "description": "the page ID of the deleted article"
        },
        "log_id": {
            "type": "integer",
            "minimum": 1,
            "description": "the LogEntry log_id associated with this event"
        },
        "summary": {
            "type": "string",
            "description": "the summary comment left by the user"
        }
    },
    "required": [
        "uri", "request_id", "event_id", "event_ts", "domain", "title", "revision"
    ]
}
