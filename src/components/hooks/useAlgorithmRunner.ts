import { useState, useEffect, useCallback } from 'react';
import EventManager from '../core/EventManager'; // Corrected default import
import AlgorithmEvent from '../core/AlgorithmEvent'; // Corrected default import
import { ObsArray } from '../core/ObsArray'; // Adjusted path
import { ObsVar } from '../core/ObsVar'; // Adjusted path
import { Subject, of, Subscription } from 'rxjs';
import { concatMap, delay, catchError, tap } from 'rxjs/operators';

type ObservablesState = Record<string, any>;
type ExecutionStatus = 'idle' | 'running' | 'paused' | 'completed' | 'error';

const EXECUTION_DELAY = 500; // ms

export interface UseAlgorithmRunnerResult {
  observablesState: ObservablesState;
  executionStatus: ExecutionStatus;
  errorMessage: string | null;
  run: (userCode: string) => void;
  pause: () => void; // Placeholder
  resume: () => void; // Placeholder
  reset: () => void; // Placeholder
}

export const useAlgorithmRunner = (): UseAlgorithmRunnerResult => {
  const [observablesState, setObservablesState] = useState<ObservablesState>({});
  const [executionStatus, setExecutionStatus] = useState<ExecutionStatus>('idle');
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [eventManagerInstance, setEventManagerInstance] = useState<EventManager | null>(null);
  const [eventSubscription, setEventSubscription] = useState<Subscription | null>(null);

  // Cleanup subscription on unmount
  useEffect(() => {
    return () => {
      eventSubscription?.unsubscribe();
      eventManagerInstance?.destroy(); // Clean up EventManager resources
    };
  }, [eventSubscription, eventManagerInstance]);

  const run = useCallback((userCode: string) => {
    // Clear previous state and unsubscribe from old event manager
    eventSubscription?.unsubscribe();
    eventManagerInstance?.destroy();
    
    setObservablesState({});
    setErrorMessage(null);
    setExecutionStatus('running');

    const newEventManager = new EventManager();
    setEventManagerInstance(newEventManager);

    const subscription = newEventManager.observable
      .pipe(
        concatMap(event => of(event).pipe(delay(EXECUTION_DELAY))),
        tap((event: AlgorithmEvent) => { // Explicitly type event
          console.log('Processing event:', event); // For debugging
          setObservablesState(prevState => ({
            ...prevState,
            [event.key]: event.value,
          }));
        }),
        catchError((err: any) => { // Explicitly type error
          console.error('Error in event stream:', err);
          setErrorMessage(`Error processing events: ${err.message || err}`);
          setExecutionStatus('error');
          return of(null); // Stop further processing
        })
      )
      .subscribe({
        next: (event) => {
          if (!event) return; // If error occurred in stream and was handled
          // Potentially update status or check for completion if specific event indicates it
        },
        error: (err) => { // This error is for the subscription itself, not usually user code errors
          console.error('Subscription error:', err);
          setErrorMessage(`Subscription error: ${err.message || err}`);
          setExecutionStatus('error');
        },
        complete: () => {
          console.log('Event stream completed.');
          // Only set to 'completed' if not already in 'error' state
          setExecutionStatus(prevStatus => prevStatus === 'error' ? 'error' : 'completed');
        },
      });
    setEventSubscription(subscription);

    try {
      // Prepare the execution function
      // We pass the *classes* ObsArray and ObsVar, and the *instance* newEventManager
      const algoFunction = new Function('ObsArray', 'ObsVar', 'eventManager', userCode);
      
      // Execute the user's code
      algoFunction(ObsArray, ObsVar, newEventManager);

      // If the user code is synchronous and finishes without emitting events,
      // or if it only sets up async operations that haven't emitted yet,
      // we might need a way to signal completion.
      // For now, completion is primarily determined by the event stream ending.
      // If the user code itself has an error, it's caught below.
      // If it runs to completion without error and without events, it will show 'running' until timeout, then 'completed'.
      // This could be improved by the user's code explicitly calling eventManager.complete()

      // Consider the case where user code finishes executing but events are still pending
      // The 'complete' callback of the subscription handles this.
      // If the user code itself doesn't throw, but no events are ever pushed,
      // the stream won't complete on its own. EventManager needs a `complete()` method.
      newEventManager.completeIfSilent(); // Call this to potentially close the stream if no events were queued.

    } catch (e: any) {
      console.error('Error executing user code:', e);
      setErrorMessage(`User code error: ${e.message || e}`);
      setExecutionStatus('error');
      newEventManager.destroy(); // Ensure cleanup if user code fails early
      eventSubscription?.unsubscribe(); // Stop listening to events
    }
  }, [eventSubscription, eventManagerInstance]); // Added dependencies

  const pause = useCallback(() => {
    setExecutionStatus('paused');
    eventManagerInstance?.pause();
    console.log('Algorithm paused');
  }, [eventManagerInstance]);

  const resume = useCallback(() => {
    if (executionStatus === 'paused') {
      setExecutionStatus('running');
      eventManagerInstance?.resume();
      console.log('Algorithm resumed');
    }
  }, [executionStatus, eventManagerInstance]);

  const reset = useCallback(() => {
    eventSubscription?.unsubscribe();
    eventManagerInstance?.destroy();
    setObservablesState({});
    setErrorMessage(null);
    setExecutionStatus('idle');
    setEventManagerInstance(null);
    setEventSubscription(null);
    console.log('Algorithm reset');
  }, [eventSubscription, eventManagerInstance]);

  return {
    observablesState,
    executionStatus,
    errorMessage,
    run,
    pause,
    resume,
    reset,
  };
};
