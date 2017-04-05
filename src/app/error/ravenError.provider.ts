import { ErrorHandler } from '@angular/core';
import Raven = require('raven-js');

class RavenErrorHandler extends ErrorHandler {

  constructor() {
    super(false);
  }

  handleError(err: any) : void {
    Raven.captureException(err);
    super.handleError(err);
    // if (ENV !== 'development') {
    //   window.alert('Une erreur est survenue, la page va être rechargée.\nSi le problème persiste, merci de réessayer ultérieurement.\nNos équipes techniques corrigent le problème.');
    //   window.location.href = window.location.origin;
    //   //window.location.reload(true); //reload without cache.
    // }
  }
}

export const ravenErrorProvider = {
  provide: ErrorHandler,
  useClass: RavenErrorHandler
};
