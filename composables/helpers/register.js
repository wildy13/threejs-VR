import { ButtonSystem } from '../systems/ButtonSystem.js';
import { DraggableSystem } from '../systems/draggableSystem.js';
import { HandRaySystem } from '../systems/handRaySystem.js';
import { InstructionSystem } from '../systems/InstructionSystem.js';
import { PanelSystem } from '../systems/PanelSystem.js';

import { Button } from '../components/ButtonComponent.js';
import { Intersectable } from '../components/intersectableComponent.js';
import { Draggable } from '../components/DraggableComponent.js';
import { HandsInstructionText } from '../components/HandsInstructionText.js';
import { Object3D } from '../components/Object3DComponent.js'
import { Panel } from '../components/PanelComponent.js';

import * as THREE from 'three';


export const register = (world, options) => {
    if (world.hasRegisteredComponent(Object3D) === false) {
        world.registerComponent(Object3D);
    }
    options.requiredFeatures.forEach(val => {
        switch (true) {
            case val.includes('button'):
                world.registerComponent(Button);
                world.registerSystem(ButtonSystem);

                for (let i = 0; i < options.button.length; i++) {
                    const buttonEntity = world.createEntity();
                    buttonEntity.addComponent(Object3D, { object: options.button[i].mesh });
                    buttonEntity.addComponent(Intersectable);
                    if (options.button[i].onClick) {
                        const action = options.button[i].onClick;
                        buttonEntity.addComponent(Button, { action: action });
                    }
                }
                break;

            case val.includes('draggable'):
                world.registerComponent(Draggable);
                world.registerSystem(DraggableSystem);
                break;

            case val.includes('handRay'):
                world.registerComponent(Intersectable);
                world.registerSystem(HandRaySystem, { handPointers: options.handPointers });
                break;

            case val.includes('instruction'):
                world.registerComponent(HandsInstructionText);
                world.registerSystem(InstructionSystem, { controllers: options.controllers });
                break;

            case val.includes('panel'):
                world.registerComponent(Panel);
                world.registerSystem(PanelSystem);

                let panelEntities = [];

                for (let i = 0; i < options.panel.length; i++) {
                    let panelEntity = world.createEntity();

                    panelEntity.addComponent(Panel, {
                        isSide: options.panel[i].isSide,
                        position: options.panel[i].position,
                        rotation: options.panel[i].rotation
                    });

                    panelEntity.addComponent(Object3D, {
                        object: options.panel[i].panel
                    });

                    panelEntities.push(panelEntity);
                }

                panelEntities.forEach(entity => {
                    entity.addComponent(Intersectable);
                    entity.addComponent(Draggable);
                });

                break;

            default:
                console.warn(`Feature ${val} is not recognized.`);
                break;
        }
    });


    return world;
}
