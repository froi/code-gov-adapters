function getConfig() {
  const filterMappings = {
    "nested": {
      "license": {
        "path": "permissions.licenses",
        "terms": ["permissions.licenses.name.keyword", "permissions.licenses.name"]
      }
    },
    "text": {
      "name": {
        "term": "name"
      },
      "agency.name": {
        "term": "agency.name"
      },
      "permissions.usageType": {
        "term": "permissions.usageType"
      }
    },
    "keyword": {
      "name": {
        "term": "name.keyword"
      },
      "agency.name": {
        "term": "agency.name.keyword"
      },
      "agency.acronym": {
        "term": "agency.acronym.keyword"
      },
      "status": {
        "term": "status"
      },
      "vcs": {
        "term": "vcs"
      },
      "measurementType.method": {
        "term": "measurementType.method"
      },
      "language": {
        "term": "languages.keyword"
      },
      "permissions.usageType": {
        "term": "permissions.usageType.keyword"
      }
    },
    "date": {
      "created": {
        "term": "date.created"
      },
      "lastModified": {
        "term": "date.lastModified"
      },
      "metadataLastUpdated": {
        "term": "date.metadataLastUpdated"
      }
    }
  };

  const sortMappings = {
    "name": {
      "field": "name.keyword"
    },
    "lastModified": {
      "field": "date.lastModified"
    },
    "score": {
      "field": "score"
    }
  };

  return {
    filterMappings,
    sortMappings
  };
}

module.exports = {
  getConfig
};
