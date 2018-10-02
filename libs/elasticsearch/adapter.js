const Elasticsearch = require('elasticsearch');
const { parseResponse } = require('./utils');

class ElasticsearchAdapter {
  constructor ({ hosts, logger, mappings=null, settings=null, requestTimeout=30000 }) {
    this.client = new Elasticsearch.Client({
      hosts: hosts,
      log: logger,
      requestTimeout
    });
    this.logger = new logger({name: 'elasticseaerch-adapter'});
    this.mappings = mappings;
    this.settings = settings;
  }

  async createIndex ({ index, settings=this.settings }) {
    try {
      let params = { index };

      if (settings) {
        const body = { settings };
        Object.assign(params, { body });
      }

      return await this.client.indices.create(params);
    } catch (error) {
      this.logger.trace(error);
      throw error;
    }
  }
  async deleteIndex (index, requestTimeout=30000) {
    try {
      return await this.client.indices.delete({ index, requestTimeout });
    } catch (error) {
      this.logger.trace(error);
      throw error;
    }
  }

  async indexExists (index) {
    try {
      return await this.client.indices.exists({ index });
    } catch (error) {
      this.logger.trace(error);
      throw error;
    }
  }

  async indexDocument ({ index, type, id=null, document }) {
    try {
      let params = { index, type, body: document };

      if (id) {
        params = Object.assign(params, { id });
      }

      return await this.client.index(params);
    } catch (error) {
      this.logger.trace(error);
      throw error;
    }
  }

  async updateDocument ({ index, type, id, document }) {
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
      this.logger.trace(error);
      throw error;
    }
  }

  async deleteDocument ({ index, type, id }) {
    try {
      return await this.client.delete({ index, type, id });
    } catch (error) {
      this.logger.trace(error);
      throw error;
    }
  }

  async getIndexForAlias ({ alias }) {
    /*
     * Elasticsearch returns the "list" of indexes as object properties.
     * {
     *   "index-name": { -> this is the index name
     *     "aliases":{
     *       "terms":{} -> this is the alias
     *     }
     *   }
     * }
     */
    try {
      const result = await this.client.indices.getAlias({ name: alias });
      const keys = Object.keys(result);

      return keys.filter(key => {
        const aliases = result[key]['aliases'];
        const aliasKeys = Object.keys(aliases);

        return aliasKeys.includes(alias);
      });
    } catch (error) {
      this.logger.trace(error);
      throw error;
    }
  }

  async initIndexMapping ({ index, type, body=this.mappings }) {
    try {
      return await this.client.indices.putMapping({ index, type, body });
    } catch (error) {
      this.logger.trace(error);
      throw error;
    }
  }

  async forceMerge ({ maxNumSegments, index, requestTimeout }) {
    try {
      return await this.client.indices.forcemerge({
        maxNumSegments, index, requestTimeout
      });
    } catch (error) {
      this.logger.trace(error);
      throw error;
    }
  }

  /**
   * Execute general search against supplied index and index type using the search query found in the body param.
   * @param {object} param0 Object with search paramaters. These are the index name {index}, the index type {type}, and the search query {body}
   * @returns {object} Result object with the result set total and result set objects.
   */
  async search ({ index, type, body=null }) {
    try {
      let params = { index, type };

      if (body) {
        params = Object.assign(params, { body });
      }

      const response = await this.client.search(params);

      return parseResponse(response);
    } catch (error) {
      this.logger.trace(error);
      throw error;
    }
  }

  async aliasExists({ name }) {
    try {
      return await this.client.indices.existsAlias({ name });
    } catch(error) {
      this.logger.trace(error);
      throw error;
    }
  }

  async updateAliases({ body }) {
    try {
      return await this.client.indices.updateAliases({ body });
    } catch(error) {
      this.logger.trace(error);
      throw error;
    }
  }

  async getSettings({ index, name }) {
    try {
      return await this.client.indices.getSettings({ index, name });
    } catch (error) {
      this.logger.trace(error);
      throw error;
    }
  }
}

module.exports = {
  ElasticsearchAdapter
};
