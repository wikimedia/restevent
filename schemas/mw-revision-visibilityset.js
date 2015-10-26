{
    "title": "MediaWiki Revision Visibility Set",
    "description": "Represents a MW Revision Visibility Set event",
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
        "revision": {
            "type": "integer",
            "minimum": 1,
            "description": "the revision ID the visibility of which is being changed"
        },
        "sha1_hidden": {
            "type": "boolean",
            "description": "whether the SHA1 of the revision's text is available"
        },
        "text_hidden": {
            "type": "boolean",
            "description": "whether the revision's text is available"
        },
        "user_hidden": {
            "type": "boolean",
            "description": "whether the author of the revision's text is available"
        },
        "comment_hidden": {
            "type": "boolean",
            "description": "whether the comment of the revision is available"
        }
    },
    "required": [
        "uri", "request_id", "event_id", "event_ts", "domain", "revision"
    ]
}
