import React, { Component, PureComponent, Children } from "react";
import PropTypes from "prop-types";
import { render, findDOMNode, unmountComponentAtNode } from "react-dom";
import { omit } from "lodash-es";

/**
 * @constant defaultContextTypes
 * @type {Object}
 */
const defaultContextTypes = {
  router: PropTypes.object,
  store: PropTypes.object,
  storeSubscription: PropTypes.object
};

/**
 * @method throwError
 * @param {String} message
 * @throws {Error}
 * @return {void}
 */
const throwError = message => {
  console.error("React Shadow", message);
};

/**
 * @method withContext
 * @param {Object} contextTypes
 * @return {ShadowDOM}
 */
export const withContext = contextTypes => {
  /**
   * @method createContextProvider
   * @param {Object} context
   * @return {ContextProvider}
   */
  const createContextProvider = context =>
    /**
     * @class ContextProvider
     * @extends {Component}
     */
    class ContextProvider extends PureComponent {
      /**
       * @constant propTypes
       * @type {Object}
       */
      static propTypes = {
        children: PropTypes.node.isRequired
      };

      state = {
        hasError: false
      };

      /**
       * @constant childContextTypes
       * @type {Object}
       */
      static childContextTypes = contextTypes;

      /**
       * @method getChildContext
       * @return {Object}
       */
      getChildContext() {
        return context;
      }

      componentDidCatch(error) {
        this.setState({ hasError: true });
        throwError(error);
      }

      /**
       * @method render
       * @return {XML}
       */
      render() {
        if (this.state.hasError) {
          return null;
        }
        return this.props.children;
      }
    };
  /**
   * @class ShadowDOM
   * @extends Component
   */
  return class ShadowDOM extends Component {
    /**
     * @constant contextTypes
     * @type {Object}
     */
    static contextTypes = contextTypes;

    /**
     * @constant propTypes
     * @type {Object}
     */
    static propTypes = {
      children: PropTypes.node.isRequired,
      include: PropTypes.oneOfType([PropTypes.string, PropTypes.array]),
      nodeName: PropTypes.string,
      boundaryMode: PropTypes.oneOf(["open", "closed"]),
      delegatesFocus: PropTypes.bool,
      innerRef: PropTypes.func,
      selectable: PropTypes.bool
    };

    /**
     * @constant defaultProps
     * @type {Object}
     */
    static defaultProps = {
      include: [],
      nodeName: "span",
      boundaryMode: "open",
      delegatesFocus: false,
      innerRef: () => {},
      selectable: false
    };

    /**
     * @constant state
     * @type {Object}
     */
    state = { resolving: false, hasError: false };

    /**
     * @constant ContextProvider
     * @type {ContextProvider}
     */
    ContextProvider = createContextProvider(this.context);

    /**
     * @constant WrappedComponent
     * @type {Object}
     */
    WrappedComponent = this.props.children;

    componentDidCatch(error) {
      this.setState({ hasError: true });
      throwError(error);
    }

    /**
     * @method componentDidMount
     * @return {void}
     */
    componentDidMount() {
      const { boundaryMode: mode, delegatesFocus } = this.props;

      // Create the shadow root and take the CSS documents from props.
      const node = findDOMNode(this);
      const root = node.attachShadow
        ? node.attachShadow({ mode, delegatesFocus })
        : node.createShadowRoot();
      const container = this.wrapContainer();

      // Render the passed in component to the shadow root, and then `setState` if there
      // are no CSS documents to be resolved.
      render(container, root);

      this.setState({ root });
    }

    /**
     * @method componentDidUpdate
     * @return {void}
     */
    componentDidUpdate() {
      // Updates consist of simply rendering the container element into the shadow root again, as
      // the `this.wrapContainer()` element contains the passed in component's children.
      render(this.wrapContainer(), this.state.root);
    }

    /**
     * @method componentWillUnmount
     * @return {void}
     */
    componentWillUnmount() {
      unmountComponentAtNode(this.state.root);
    }

    /**
     * @method wrapContainer
     * @return {Object}
     */
    wrapContainer() {
      // Wrap children in a container if it's an array of children, otherwise simply render the single child
      // which is a valid `ReactElement` instance.
      const { children } = this.props.children.props;
      const child = children.length ? (
        <this.props.nodeName>{children}</this.props.nodeName>
      ) : (
        children
      );
      const ContextProvider = this.ContextProvider;

      /**
       * @method getChildContext
       * @return {Object}
       */
      ContextProvider.prototype.getChildContext = () => this.context;

      return <ContextProvider>{child}</ContextProvider>;
    }

    innerContent = () => {
      // Props from the passed component, minus `children` as that's handled by `componentDidMount`.
      const child = Children.only(this.props.children);
      const childProps = omit(child.props, ["children"]);
      const className = this.state.resolving
        ? "x-diff-widget-resolving"
        : "x-diff-widget-resolved";
      const classNames = `${
        childProps.className ? childProps.className : ""
      } ${className}`.trim();
      const props = {
        ...childProps,
        className: classNames
      };

      return (
        <child.type
          {...props}
          ref={this.props.innerRef}
          data-diff-selectable={this.props.selectable}
        />
      );
    };

    /**
     * @method render
     * @return {XML}
     */
    render() {
      if (this.state.hasError) {
        return null;
      }

      return this.innerContent();
    }
  };
};

export default withContext(defaultContextTypes);
