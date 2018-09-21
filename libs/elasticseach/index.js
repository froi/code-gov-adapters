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

  async initIndexMapping( { index, type, mapping }) {
    try {
      return await this.client.putMapping( {
        index,
        type,
        body: mapping
      });
    } catch (error) {
      console.error(error)
      throw error;
    }
  }
}

module.exports = ElasticsearchAdapter;
