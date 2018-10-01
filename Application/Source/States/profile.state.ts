import { EntityState } from '@datorama/akita';
import { Profile } from '../Models/profile.model';

export interface ProfileState extends EntityState<Profile> { }
