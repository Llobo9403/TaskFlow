import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { Pages } from '../../constants/pages.enum';

@Injectable({
  providedIn: 'root'
})
export class RotasService {
  private readonly _pageSubject = new BehaviorSubject<Pages>(Pages.DASHBOARD);

  readonly page$: Observable<Pages> = this._pageSubject.asObservable()


  get currentPage(): Pages {
    return this._pageSubject.value;
  }

  setPage(page: Pages): void {
    this._pageSubject.next(page);
  }
}
