const create_repos_index_response = {
  "acknowledged": true,
  "shards_acknowledged": true,
  "index": "repos"
};
const delete_index_response = { "acknowledged":true };
const index_document_response = {
  "_shards" : {
      "total" : 2,
      "failed" : 0,
      "successful" : 2
  },
  "_index" : "repos",
  "_type" : "repo",
  "_id" : "1",
  "_version" : 1,
  "created" : true,
  "result" : "created"
};
const update_document_response = {
  "_shards": {
    "total": 1,
    "successful": 1,
    "failed": 0
  },
  "_index": "repos",
  "_type": "repo",
  "_id": "1",
  "_version": 2,
  "result": 'updated'
};

const delete_document_response = {
  "_shards" : {
      "total" : 2,
      "failed" : 0,
      "successful" : 2
  },
  "found" : true,
  "_index" : "repos",
  "_type" : "repo",
  "_id" : "1",
  "_version" : 2,
  "result": "deleted"
};

const indexes_for_alias_response = {
  "repos1": {
    "aliases": {
      "repos":{}
    }
  },
  "repos2": {
    "aliases": {
      "repos":{}
    }
  },
  "repos3": {
    "aliases": {
      "repos":{}
    }
  },
  "repos4": {
    "aliases": {
      "repos":{}
    }
  }
};

const put_mapping_response = { "acknowledged":true };

const alias_exists_reponse = {
  "repos20181025_232139": {
    "aliases":{
      "repos":{}
    }
  }
};
const alias_exists_404_reponse = { "error": "alias [froi] missing", "status": 404 };

module.exports = {
  create_repos_index_response,
  delete_index_response,
  index_document_response,
  alias_exists_reponse,
  alias_exists_404_reponse,
  update_document_response,
  delete_document_response,
  indexes_for_alias_response,
  put_mapping_response
};
