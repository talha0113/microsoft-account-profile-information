import { TestBed, ComponentFixture, ComponentFixtureAutoDetect } from '@angular/core/testing';

import { StatusComponent } from './status.component';
import { setUpMock } from '../../Managers/storage.mock';

let fixture: ComponentFixture<StatusComponent>;
let component: StatusComponent

describe('Status Component', () => {

    beforeAll(async () => {
        setUpMock();
    });

    beforeAll(async () => {
        TestBed.configureTestingModule({
            declarations: [
                StatusComponent
            ]
        }).compileComponents();        
    });

    beforeAll(async () => {
        fixture = TestBed.createComponent(StatusComponent);
        component = fixture.componentInstance;
    });

    it('Should exist', async () => {
        expect(component).toBeTruthy();
    });

    it('Should render message', async () => {
        let nativeElement: HTMLElement = fixture.debugElement.nativeElement;
        let messageDiv: HTMLDivElement = nativeElement.querySelector('div');

        expect(messageDiv.textContent).toContain('You are');
    });
    
});
