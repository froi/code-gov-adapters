const Elasticsearch = require('elasticsearch');

class ElasticsearchAdapter {
  constructor({hosts, logger}) {
    this.client = new Elasticsearch.Client({
      hosts: hosts,
      log: logger
    });
  }

  async createIndex({ index, settings=null }) {
    try {
      let params = { index };

      if(settings) {
        const body = { settings };
        Object.assign(params, { body });
      }

      return await this.client.indices.create(params);
    } catch(error) {
      console.error(error)
      throw error
    }
  }
  async deleteIndex( index ) {
    try {
      return await this.client.indices.delete( { index });
    } catch(error) {
      console.error(error)
      throw error
    }
  }

  async indexExists( index ) {
    try {
      return await this.client.indices.exists( { index });
    } catch (error) {
      console.error(error);
      throw error;
    }
  }

  async indexDocument( { index, type, id=null, document }) {
    try {
      let params = { index, type, body: document };

      if(id) {
        params = Object.assign(params, { id });
      }

      return await this.client.index(params);

    } catch(error) {
      console.error(error);
      throw error;
    }
  }

  async updateDocument( { index, type, id, document }) {
    try {
      return await this.client.update({
        index,
        type,
        id,
        body: {
          doc: document
        }
      });
    } catch (error) {
      console.error(error);
      throw error;
    }
  }

  async deleteDocument( { index, type, id }) {
    try {
      return await this.client.delete({ index, type, id});
    } catch (error) {
      console.error(error);
      throw error;
    }
  }

  async getIndexForAlias( { alias }) {
    /*
     * Elasticsearch returns the "list" of indexes as object properties.
     * {
     *   "terms20180913_220819": { -> this is the index name
     *     "aliases":{
     *       "terms":{} -> this is the alias
     *     }
     *   }
     * }
     */
    try {
      const result =  await this.client.getAlias({ name: alias });
      const keys = Object.keys(result);

      return keys.filter(key => {
        const aliases = result[key]['aliases'];
        const aliasKeys = Object.keys(aliases);

        return aliasKeys.includes(alias)
      });

    } catch (error) {
      console.error(error);
      throw error;
    }
  }

  async initIndexMapping( { index, type, body }) {
    try {
      return await this.client.indices.putMapping( { index, type, body });
    } catch (error) {
      console.error(error)
      throw error;
    }
  }

  async forceMerge({ maxNumSegments, index, requestTimeout }) {
    try {
      return await this.client.indices.forcemerge({
        maxNumSegments, index, requestTimeout
      });
    } catch(error) {
      console.error(error);
      throw error;
    }
  }

  async getSearchByFieldValue({ index, type, field, value }) {
    logger.debug("Entered getRepoId: ", {value});
    try {
      const results = await this.client.search({
        index,
        type,
        body: createQueryBody('must', field, value)
      });

      return parseResponse(results)

    } catch(error) {
      logger.error(error);
      throw error;
    }
  }

  async search({ index, type, searchTerm }) {
    try {
      const response = await this.client.search({
        index,
        type,
        body: createSearchQuery(searchTerm)
      });

      let repos = Utils.omitPrivateKeys(
        _.map(elasticSearchResponse.hits.hits, (hit) => {
          let repo = _.merge({ searchScore: hit._score }, hit._source);
          return repo;
        })
      );

      let formattedRes = {
        total: elasticSearchResponse.hits.total,
        repos: repos
      };
      return callback(null, formattedRes);

    } catch(error) {
      console.error(error);
      throw error;
    }
  }
  async searchTerms(queryParams) {
    // logger.info("Term searching", q);
    try{
      const results = await this.adapter.search({
        index: 'terms',
        type: 'term',
        body: this._searchTermsQuery(queryParams)
      });

      return {
        total: res.hits.total,
        terms: _.map(res.hits.hits, (hit) => {
          let source = hit._source;
          source.score = hit._score;
          return source;
        })
      };
    } catch(error) {
      console.error(error);
      throw error;
    }
  }

  searchStatus(callback) {
    logger.info("Status searching");

    this.adapter.search({
      index: 'status',
      type: 'status'
    }, (error, elasticSearchResponse) => {
      if(error) {
        logger.error(error);
        return callback(error);
      }
      const data = Utils.omitPrivateKeys(
        _.map(elasticSearchResponse.hits.hits, (hit) => {
          return hit._source;
        })
      );
      return callback(null,  data);
    });
  }
}

module.exports = {
  ElasticsearchAdapter
};
