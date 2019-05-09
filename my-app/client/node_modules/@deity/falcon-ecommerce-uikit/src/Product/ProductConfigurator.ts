import React from 'react';

/**
 * Available options that can be changed. Currently ProductConfigurator handles only product configurable options.
 */
export type OptionType = 'configurableOption' | 'bundleOption';

/**
 * Change source - currently only React.ChangeEvent is supported so only change from UI can be handled.
 * In the future we'll probably need also custom change handler (passing name and value of changed option).
 */
type HandleChangeParam = React.ChangeEvent<any>;

/**
 * Properties injected to render prop function
 */
type ProductConfiguratorInjectedProps = {
  /**
   *
   * @param type - type of the changed option (currently only configurable products are supported so 'configurableOption' goes here)
   * @param ev - change event
   */
  handleProductConfigurationChange(type: OptionType, ev: HandleChangeParam): void;
  /**
   * Helper that allows to check if a particular option is already selected
   * @param type - type of option to check
   * @param name - name of option to check
   * @param value  - value to check
   */
  isValueSelected(type: OptionType, name: string, value: any): boolean;
};

type ProductConfiguratorProps = {
  /**
   * Handler which will be called when option change has been processed and we have final state after change that can be submitted
   * @param name - name of changed option
   * @param value - final value of changed option
   */
  onChange(name: string, value: any): void;
  /**
   * Render prop function that should return valid react element
   * @param props - props passed to render function
   */
  children(props: ProductConfiguratorInjectedProps): any;
};

type ProductConfiguratorState = {
  selectedConfigurableOptions: { [name: string]: any };
};

/**
 * ProductConfigurator takes care of handling data relaed to product options available to be selected before adding to cart.
 * Currently only configurable options are supported, in the future that class will handle bundled products as well as custom product attributes.
 */
export class ProductConfigurator extends React.Component<ProductConfiguratorProps, ProductConfiguratorState> {
  state: ProductConfiguratorState = {
    selectedConfigurableOptions: {}
  };

  /**
   * Handles change of configurable product option
   * @param {string} name - name of the option
   * @param {any} value - value of changed option
   */
  handleConfigurationOptionChange(name: string, value: any) {
    this.setState(
      (state: ProductConfiguratorState) => ({
        selectedConfigurableOptions: {
          ...state.selectedConfigurableOptions,
          [name]: value
        }
      }),
      () => {
        // when state is set then update form manager
        const configurableOptions = Object.entries(this.state.selectedConfigurableOptions).map(item => ({
          optionId: parseInt(item[0], 10),
          value: parseInt(item[1], 10)
        }));
        this.props.onChange('configurableOptions', configurableOptions);
      }
    );
  }

  /**
   * Handler for all configuration changes, based on the type invokes proper type handler
   * @param {OptionType} type - type of the change
   * @param {HandleChangeParam} ev - change data
   */
  handleProductConfigurationChange = (type: OptionType, ev: HandleChangeParam) => {
    const { name, value } = ev.target;

    if (type === 'configurableOption') {
      this.handleConfigurationOptionChange(name, value);
    }
  };

  /**
   * Checks if passed value is selected.
   * @param {OptionType} type - type of the option to check
   * @param {string} name - name of the option to check
   * @param {any} value - value of the option to check
   * @returns {boolean} true when option with passed name has passed value
   */
  isValueSelected = (type: OptionType, name: string, value: any): boolean => {
    if (type === 'configurableOption') {
      return this.state.selectedConfigurableOptions.get(name) === value;
    }
    return false;
  };

  render() {
    return this.props.children({
      handleProductConfigurationChange: this.handleProductConfigurationChange,
      isValueSelected: this.isValueSelected
    });
  }
}
