import {Component, ChangeDetectionStrategy, Input, ChangeDetectorRef} from "@angular/core";
import {Compbaser} from "../compbaser/Compbaser";
import {NgMenuItem} from "./ng-menu-item";
import {Consts} from "../../Conts";
import {IMessage, CommBroker} from "../../services/CommBroker";
import {Router} from "@angular/router";

@Component({
    selector: 'ng-menu',
    changeDetection: ChangeDetectionStrategy.OnPush,
    template: `
            <ng-container *ngIf="fileMenuMode">
                <section id="appNavigatorWasp" class="appMenu fill hidden-xs hidden-sm hidden-md col-lg-1">
                     <li *ngFor="let item of items" (click)="listenMenuSelected(item.getTitle, $event)" data-ripple-color="white" class="btn btn-default list-group-item navicons">
                        <i *ngIf="!m_hidden" (click)="listenMenuSelected(item.getTitle, $event)" class="iconSize fa {{item.getFontAwesome}}"></i>
                        <span (click)="listenMenuSelected(item.getTitle, $event)">{{item.getTitle}}</span>
                      </li>
                  </section>
            </ng-container>
            <ng-container *ngIf="!fileMenuMode">
                 <div>
                     <div class="m_fileMenuWrap">
                        <ul class="nav navbar-nav" >
                        <li id="commonFileMenu" class="hidden-lg" dropdown>
                          <a href="#" class="dropdown-toggle" data-toggle="dropdown">Menu<b class="caret"></b></a>
                          <ul class="dropdown-menu">
                          <li class="divider"></li>
                            <li *ngFor="let item of items" (click)="listenMenuSelected(item.getTitle, $event)">
                               <a href="#" (click)="listenMenuSelected(item.getTitle,$event)">{{item.getTitle}}</a>
                            </li>
                            <li class="divider"></li>
                          </ul>
                        </li>
                      </ul>
                    </div>
                 </div>
            </ng-container>
            
           `,
    styles: [`
        .appMenu {
          background: #3e3f48;
        }
        .navicons {
            font-size: 0.9em;
            position: relative;
            top: 2px;
            left: 0px;
            text-align: left;
            padding-right: 5px;
        }
        .iconSize {
            font-size: 1.3em;
        }
  `]
})
export class NgMenu extends Compbaser {

    constructor(private router: Router, private commBroker: CommBroker, private cd:ChangeDetectorRef) {
        super();
    }

    ngOnInit() {
        this.m_hidden = false;
        this.listenWinResize()
    }

    @Input() fileMenuMode: boolean = true;
    @Input() routePrefix: string = '';

    private items: Array<NgMenuItem> = [];
    private m_hidden: boolean = true;

    private listenWinResize() {
        this.commBroker.onEvent(Consts.Events().WIN_SIZED).subscribe((e: IMessage) => {
            if (e.message.width < Consts.Values().MENU_MIN_ICON_SHOW) {
                this.m_hidden = true;
            } else {
                this.m_hidden = false;
            }
            this.cd.markForCheck();
        });
    }

    private listenMenuSelected(routeTo, event:MouseEvent) {
        event.preventDefault();
        this.router.navigate([`/${this.routePrefix}/${routeTo}`]);
    }

    public addMenuItem(i_item: NgMenuItem): void {
        this.items.push(i_item);
    }


    destroy() {
    }
}