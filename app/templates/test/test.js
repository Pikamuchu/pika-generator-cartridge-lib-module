import sinon from 'sinon';
import { assert } from 'chai';
import searchquire from 'searchquire';

describe('<%= module_name %> library', () => {
    let <%= module_name %>;

    before(() => {
        // initialize test config and spies
        <%= module_name %> = searchquire(
            '*/cartridge/scripts/lib/<%= module_name %>/index',
            {
                basePath: '../cartridges/lib_<%= module_name %>/cartridge',
                pattern: '*/cartridge/(.*)',
                maxSearchModuleIterations: 20
            },
            {}
        );
    });

    beforeEach(() => {
        // reset spies
    });

    describe('<%= module_name %> initialization', () => {
        it('<%= module_name %> defined', () => {
            assert.isDefined(<%= module_name %>)
        });
    });
});
