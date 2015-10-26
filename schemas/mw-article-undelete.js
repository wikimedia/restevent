{
    "title": "MediaWiki Article Undelete",
    "description": "Represents a MW Article Undelete Edit event",
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
            "description": "the new page ID of the restored article"
        },
        "old_page_id": {
            "type": "integer",
            "minimum": 1,
            "description": "the old page ID of the restored article"
        },
        "namespace": {
            "type": "integer",
            "description": "the namespace ID the page belongs to"
        },
        "revision": {
            "type": "integer",
            "minimum": 1,
            "description": "the revision ID created by this event"
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
