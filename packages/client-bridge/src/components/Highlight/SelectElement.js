import React from "react";
import PropTypes from "prop-types";
import inspect from "./highlightElement";

/**
 * Render props class that provides the ability to
 * perform a selection on the screen and get back an element
 */
export default class Selectors extends React.Component {
  static propTypes = {
    /**
     * function to start inspecting the DOM
     */
    domInspect: PropTypes.func,

    onSelect: PropTypes.func.isRequired,

    onCancel: PropTypes.func.isRequired
  };

  static defaultProps = {
    domInspect: inspect
  };

  componentDidMount() {
    this.getSelector();
  }

  componentWillUnmount() {
    document.querySelectorAll(".diff-selected").forEach(node => {
      node.classList.remove("diff-selected");
    });

    this.cancelInspection();
  }

  /**
   * Enables an inspector in the browser that allows a user
   * to target any element on the page. On selection of
   * an element then this value will be passed by to the
   * child who is using this
   */
  getSelector = () => {
    const {
      props: { domInspect, onSelect, onCancel },
      cancelInspection
    } = this;

    const inspect$ = domInspect(this.highlightListener);

    const subscriber = inspect$.subscribe(
      element => {
        if (element !== null) {
          onSelect(element);
        } else {
          onCancel("escapped");
        }

        this.getSelector();
      },
      error => {
        cancelInspection();
        onCancel(error);
      },
      val => {
        console.log("complete", val);
      }
    );

    this.inspect$ = inspect$;
    this.subscriber = subscriber;
  };

  /**
   * Cancels the inspection of an element
   */
  cancelInspection = () => {
    if (this.inspect$) {
      this.inspect$.forceStop();
      this.inspect$ = null;
    }

    if (this.subscriber) {
      this.subscriber.unsubscribe();
      this.subscriber = null;
    }
  };

  render() {
    return null;
  }
}
